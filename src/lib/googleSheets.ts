import { logger } from './logger';

export interface GoogleSheetsData {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  plan: string;
  timestamp?: string;
}

class GoogleSheetsService {
  private webhookUrl: string | null = null;

  constructor() {
    // Load webhook URL from localStorage - no automatic demo webhook
    this.webhookUrl = localStorage.getItem('google_sheets_webhook_url');
  }

  setWebhookUrl(url: string) {
    this.webhookUrl = url;
    localStorage.setItem('google_sheets_webhook_url', url);
  }

  getWebhookUrl(): string | null {
    return this.webhookUrl;
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

  // Test if webhook URL is a valid Zapier webhook
  isValidZapierWebhook(url: string): boolean {
    return url.includes('hooks.zapier.com') || url.includes('script.google.com');
  }
}

export const googleSheetsService = new GoogleSheetsService();