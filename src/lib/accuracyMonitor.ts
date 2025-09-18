import { logger } from './logger';

export interface AccuracyMetrics {
  category: string;
  predictionAccuracy: number;
  dataQuality: number;
  userSatisfaction: number;
  timestamp: Date;
}

export interface AccuracyTrend {
  category: string;
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
  period: string;
}

/**
 * Monitor and improve recommendation accuracy over time
 */
export class AccuracyMonitor {
  private static readonly STORAGE_KEY = 'recommendation_accuracy_metrics';
  private static readonly MAX_METRICS = 1000; // Keep last 1000 entries

  /**
   * Record accuracy metrics for a recommendation
   */
  static recordAccuracy(metrics: Omit<AccuracyMetrics, 'timestamp'>): void {
    try {
      const fullMetrics: AccuracyMetrics = {
        ...metrics,
        timestamp: new Date()
      };

      const existingMetrics = this.getStoredMetrics();
      existingMetrics.push(fullMetrics);

      // Keep only the most recent metrics
      if (existingMetrics.length > this.MAX_METRICS) {
        existingMetrics.splice(0, existingMetrics.length - this.MAX_METRICS);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingMetrics));
      
      logger.info('Recorded accuracy metrics', 'AccuracyMonitor', {
        category: metrics.category,
        predictionAccuracy: metrics.predictionAccuracy,
        dataQuality: metrics.dataQuality
      });

    } catch (error) {
      logger.error('Failed to record accuracy metrics', 'AccuracyMonitor', error);
    }
  }

  /**
   * Get accuracy metrics by category
   */
  static getAccuracyByCategory(category: string, days: number = 30): AccuracyMetrics[] {
    try {
      const metrics = this.getStoredMetrics();
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      return metrics.filter(m => 
        m.category === category && 
        new Date(m.timestamp) >= cutoffDate
      );
    } catch (error) {
      logger.error('Failed to get accuracy by category', 'AccuracyMonitor', error);
      return [];
    }
  }

  /**
   * Calculate average accuracy for a category
   */
  static getAverageAccuracy(category: string, days: number = 30): number {
    try {
      const metrics = this.getAccuracyByCategory(category, days);
      
      if (metrics.length === 0) return 0.7; // Default accuracy

      const totalAccuracy = metrics.reduce((sum, m) => sum + m.predictionAccuracy, 0);
      return totalAccuracy / metrics.length;
    } catch (error) {
      logger.error('Failed to calculate average accuracy', 'AccuracyMonitor', error);
      return 0.7; // Default accuracy
    }
  }

  /**
   * Get accuracy trends for all categories
   */
  static getAccuracyTrends(days: number = 30): AccuracyTrend[] {
    try {
      const categories = ['electricity', 'cellular', 'internet', 'tv'];
      const trends: AccuracyTrend[] = [];

      for (const category of categories) {
        const recent = this.getAccuracyByCategory(category, days);
        const older = this.getAccuracyByCategory(category, days * 2).filter(m => {
          const metricDate = new Date(m.timestamp);
          const cutoffRecent = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
          const cutoffOlder = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000);
          return metricDate < cutoffRecent && metricDate >= cutoffOlder;
        });

        if (recent.length === 0 && older.length === 0) continue;

        const recentAvg = recent.length > 0 ? 
          recent.reduce((sum, m) => sum + m.predictionAccuracy, 0) / recent.length : 0;
        const olderAvg = older.length > 0 ? 
          older.reduce((sum, m) => sum + m.predictionAccuracy, 0) / older.length : recentAvg;

        let trend: 'improving' | 'stable' | 'declining';
        const changePercent = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

        if (Math.abs(changePercent) < 2) {
          trend = 'stable';
        } else if (changePercent > 0) {
          trend = 'improving';
        } else {
          trend = 'declining';
        }

        trends.push({
          category,
          trend,
          changePercent: Math.abs(changePercent),
          period: `${days} days`
        });
      }

      return trends;
    } catch (error) {
      logger.error('Failed to get accuracy trends', 'AccuracyMonitor', error);
      return [];
    }
  }

  /**
   * Get data quality issues by category
   */
  static getDataQualityIssues(category?: string): {
    category: string;
    avgQuality: number;
    issueCount: number;
    lastIssue: Date | null;
  }[] {
    try {
      const metrics = this.getStoredMetrics();
      const categories = category ? [category] : ['electricity', 'cellular', 'internet', 'tv'];
      
      return categories.map(cat => {
        const categoryMetrics = metrics.filter(m => m.category === cat);
        const lowQualityMetrics = categoryMetrics.filter(m => m.dataQuality < 0.7);
        
        const avgQuality = categoryMetrics.length > 0 ? 
          categoryMetrics.reduce((sum, m) => sum + m.dataQuality, 0) / categoryMetrics.length : 0;
        
        const lastIssue = lowQualityMetrics.length > 0 ? 
          new Date(Math.max(...lowQualityMetrics.map(m => new Date(m.timestamp).getTime()))) : null;

        return {
          category: cat,
          avgQuality,
          issueCount: lowQualityMetrics.length,
          lastIssue
        };
      });
    } catch (error) {
      logger.error('Failed to get data quality issues', 'AccuracyMonitor', error);
      return [];
    }
  }

  /**
   * Generate improvement recommendations
   */
  static getImprovementRecommendations(): string[] {
    try {
      const recommendations: string[] = [];
      const trends = this.getAccuracyTrends();
      const qualityIssues = this.getDataQualityIssues();

      // Check for declining accuracy trends
      const decliningCategories = trends.filter(t => t.trend === 'declining');
      if (decliningCategories.length > 0) {
        recommendations.push(
          `שיפור נתונים נדרש בקטגוריות: ${decliningCategories.map(c => c.category).join(', ')}`
        );
      }

      // Check for low data quality
      const lowQualityCategories = qualityIssues.filter(q => q.avgQuality < 0.6);
      if (lowQualityCategories.length > 0) {
        recommendations.push(
          `איכות נתונים נמוכה בקטגוריות: ${lowQualityCategories.map(c => c.category).join(', ')}`
        );
        recommendations.push('בדוק ווליד את נתונים שהוזנו על ידי המשתמשים');
      }

      // Check for insufficient data
      const insufficientData = qualityIssues.filter(q => q.issueCount === 0 && q.avgQuality === 0);
      if (insufficientData.length > 0) {
        recommendations.push(
          `אין מספיק נתונים לקטגוריות: ${insufficientData.map(c => c.category).join(', ')}`
        );
      }

      return recommendations.length > 0 ? recommendations : ['מערכת ההמלצות פועלת בצורה מיטבית'];

    } catch (error) {
      logger.error('Failed to generate improvement recommendations', 'AccuracyMonitor', error);
      return ['שגיאה בניתוח המערכת'];
    }
  }

  /**
   * Export metrics for analysis
   */
  static exportMetrics(): string {
    try {
      const metrics = this.getStoredMetrics();
      return JSON.stringify(metrics, null, 2);
    } catch (error) {
      logger.error('Failed to export metrics', 'AccuracyMonitor', error);
      return '';
    }
  }

  /**
   * Clear old metrics (keep last N days)
   */
  static cleanupMetrics(keepDays: number = 90): void {
    try {
      const metrics = this.getStoredMetrics();
      const cutoffDate = new Date(Date.now() - keepDays * 24 * 60 * 60 * 1000);
      
      const filteredMetrics = metrics.filter(m => new Date(m.timestamp) >= cutoffDate);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredMetrics));
      
      logger.info('Cleaned up accuracy metrics', 'AccuracyMonitor', {
        originalCount: metrics.length,
        remainingCount: filteredMetrics.length,
        keepDays
      });
    } catch (error) {
      logger.error('Failed to cleanup metrics', 'AccuracyMonitor', error);
    }
  }

  /**
   * Get stored metrics from localStorage
   */
  private static getStoredMetrics(): AccuracyMetrics[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })) : [];
    } catch (error) {
      logger.error('Failed to get stored metrics', 'AccuracyMonitor', error);
      return [];
    }
  }

  /**
   * Record user feedback on recommendation accuracy
   */
  static recordUserFeedback(
    category: string,
    recommendationId: string,
    feedback: {
      wasAccurate: boolean;
      actualSavings?: number;
      expectedSavings?: number;
      rating: number; // 1-5
      comments?: string;
    }
  ): void {
    try {
      const predictionAccuracy = feedback.wasAccurate ? 0.9 : 0.3;
      const dataQuality = (feedback.actualSavings && feedback.expectedSavings) ? 
        Math.min(1, 1 - Math.abs(feedback.actualSavings - feedback.expectedSavings) / feedback.expectedSavings) : 0.7;
      const userSatisfaction = feedback.rating / 5;

      this.recordAccuracy({
        category,
        predictionAccuracy,
        dataQuality,
        userSatisfaction
      });

      logger.info('Recorded user feedback', 'AccuracyMonitor', {
        category,
        recommendationId,
        rating: feedback.rating,
        wasAccurate: feedback.wasAccurate
      });

    } catch (error) {
      logger.error('Failed to record user feedback', 'AccuracyMonitor', error);
    }
  }
}
