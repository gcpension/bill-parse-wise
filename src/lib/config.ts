import { logger } from './logger';

interface AppConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  signTrustApiKey?: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

class ConfigManager {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): AppConfig {
    return {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      signTrustApiKey: import.meta.env.VITE_SIGNTRUST_API_KEY,
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
    };
  }

  private validateConfig() {
    const requiredKeys: (keyof AppConfig)[] = [];
    const missingKeys: string[] = [];

    // Only validate required keys for features that are actually used
    if (this.config.supabaseUrl && !this.config.supabaseAnonKey) {
      missingKeys.push('VITE_SUPABASE_ANON_KEY');
    }

    if (missingKeys.length > 0) {
      logger.warn('Missing environment variables', 'ConfigManager', { missingKeys });
    }
  }

  get supabase() {
    return {
      url: this.config.supabaseUrl,
      anonKey: this.config.supabaseAnonKey,
      isConfigured: !!(this.config.supabaseUrl && this.config.supabaseAnonKey),
    };
  }

  get signTrust() {
    return {
      apiKey: this.config.signTrustApiKey,
      isConfigured: !!this.config.signTrustApiKey,
    };
  }

  get environment() {
    return {
      isDevelopment: this.config.isDevelopment,
      isProduction: this.config.isProduction,
    };
  }
}

export const config = new ConfigManager();