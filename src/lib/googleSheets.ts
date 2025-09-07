import { logger } from './logger';

export interface GoogleSheetsData {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  plan: string;
  timestamp?: string;
}

export interface AnalysisData {
  // Meta information
  flow: string;
  source_page: string;
  triggered_from: string;
  timestamp: string;
  active_categories: string[];
  
  // Electricity
  electricity_active: boolean;
  electricity_current_provider?: string;
  electricity_monthly_amount?: number;
  electricity_account_details?: string;
  electricity_recommended_plan_name?: string;
  electricity_recommended_price?: number;
  electricity_monthly_savings?: number;
  electricity_annual_savings?: number;
  
  // Internet
  internet_active: boolean;
  internet_current_provider?: string;
  internet_monthly_amount?: number;
  internet_account_details?: string;
  internet_recommended_plan_name?: string;
  internet_recommended_price?: number;
  internet_monthly_savings?: number;
  internet_annual_savings?: number;
  
  // Cellular
  cellular_active: boolean;
  cellular_current_provider?: string;
  cellular_monthly_amount?: number;
  cellular_account_details?: string;
  cellular_recommended_plan_name?: string;
  cellular_recommended_price?: number;
  cellular_monthly_savings?: number;
  cellular_annual_savings?: number;
  
  // TV/Streaming
  tv_active: boolean;
  tv_current_provider?: string;
  tv_monthly_amount?: number;
  tv_account_details?: string;
  tv_recommended_plan_name?: string;
  tv_recommended_price?: number;
  tv_monthly_savings?: number;
  tv_annual_savings?: number;
  
  // Totals
  total_monthly_amount: number;
  total_monthly_savings: number;
  total_annual_savings: number;
}

const STORAGE_KEY = 'zapier_webhook_url';
const ADDITIONAL_WEBHOOK_KEY = 'additional_webhook_url';

class GoogleSheetsService {
  private webhookUrl: string = '';
  private additionalWebhookUrl: string = '';

  constructor() {
    // Load webhook URLs from localStorage
    this.loadWebhookUrl();
    this.loadAdditionalWebhookUrl();
  }

  private loadWebhookUrl() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.webhookUrl = saved;
      }
    } catch (error) {
      logger.error('Failed to load webhook URL from localStorage', 'GoogleSheetsService', error);
    }
  }

  private loadAdditionalWebhookUrl() {
    try {
      const saved = localStorage.getItem(ADDITIONAL_WEBHOOK_KEY);
      if (saved) {
        this.additionalWebhookUrl = saved;
      }
    } catch (error) {
      logger.error('Failed to load additional webhook URL from localStorage', 'GoogleSheetsService', error);
    }
  }

  setWebhookUrl(url: string) {
    this.webhookUrl = url;
    try {
      if (url) {
        localStorage.setItem(STORAGE_KEY, url);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      logger.info('Webhook URL updated successfully', 'GoogleSheetsService');
    } catch (error) {
      logger.error('Failed to save webhook URL to localStorage', 'GoogleSheetsService', error);
    }
  }

  getWebhookUrl(): string {
    return this.webhookUrl;
  }

  setAdditionalWebhookUrl(url: string) {
    this.additionalWebhookUrl = url;
    try {
      if (url) {
        localStorage.setItem(ADDITIONAL_WEBHOOK_KEY, url);
      } else {
        localStorage.removeItem(ADDITIONAL_WEBHOOK_KEY);
      }
      logger.info('Additional webhook URL updated successfully', 'GoogleSheetsService');
    } catch (error) {
      logger.error('Failed to save additional webhook URL to localStorage', 'GoogleSheetsService', error);
    }
  }

  getAdditionalWebhookUrl(): string {
    return this.additionalWebhookUrl;
  }

  async submitToGoogleSheets(data: GoogleSheetsData): Promise<boolean> {
    if (!this.webhookUrl) {
      logger.warn('Zapier webhook URL not configured', 'GoogleSheetsService');
      return false;
    }

    try {
      const payload = {
        ...data,
        timestamp: new Date().toISOString(),
        sheetName: 'לקוחות טפסים נכנסים',
        triggered_from: window.location.origin
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // Handle CORS for Zapier webhooks
        body: JSON.stringify(payload)
      });

      // Since we're using no-cors, we won't get a proper response status
      // We'll assume success if no error is thrown
      logger.info('Data successfully sent to Zapier webhook', 'GoogleSheetsService', payload);
      return true;
    } catch (error) {
      logger.error('Failed to send data to Zapier webhook', 'GoogleSheetsService', error);
      return false;
    }
  }

  async submitAnalysisData(data: AnalysisData): Promise<boolean> {
    const promises: Promise<boolean>[] = [];
    
    // Send to Zapier webhook (Google Sheets)
    if (this.webhookUrl) {
      promises.push(this.sendToWebhook(this.webhookUrl, data, 'Google Sheets'));
    }
    
    // Send to additional webhook if configured
    if (this.additionalWebhookUrl) {
      promises.push(this.sendToWebhook(this.additionalWebhookUrl, data, 'Additional Webhook'));
    }
    
    if (promises.length === 0) {
      logger.warn('No webhooks configured for analysis data submission', 'GoogleSheetsService');
      return false;
    }

    try {
      const results = await Promise.allSettled(promises);
      const successful = results.filter(result => result.status === 'fulfilled' && result.value).length;
      
      logger.info(`Analysis data sent to ${successful}/${promises.length} webhooks successfully`, 'GoogleSheetsService');
      return successful > 0; // Return true if at least one webhook succeeded
    } catch (error) {
      logger.error('Failed to send analysis data to webhooks', 'GoogleSheetsService', error);
      return false;
    }
  }

  private async sendToWebhook(url: string, data: any, webhookName: string): Promise<boolean> {
    try {
      const payload = {
        ...data,
        sheetName: 'השוואת מחירים - תוצאות ניתוח',
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });

      logger.info(`Data successfully sent to ${webhookName}`, 'GoogleSheetsService', payload);
      return true;
    } catch (error) {
      logger.error(`Failed to send data to ${webhookName}`, 'GoogleSheetsService', error);
      return false;
    }
  }

  isValidZapierWebhook(url: string): boolean {
    return url.includes('hooks.zapier.com') || url.includes('script.google.com') || url.includes('webhook.site');
  }

export const googleSheetsService = new GoogleSheetsService();
