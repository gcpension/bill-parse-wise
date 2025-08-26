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
    // Load webhook URL from localStorage
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
      logger.warn('Google Sheets webhook URL not configured', 'GoogleSheetsService');
      return false;
    }

    try {
      const payload = {
        ...data,
        timestamp: new Date().toISOString(),
        sheetName: 'לקוחות טפסים נכנסים'
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      logger.info('Data successfully sent to Google Sheets', 'GoogleSheetsService', payload);
      return true;
    } catch (error) {
      logger.error('Failed to send data to Google Sheets', 'GoogleSheetsService', error);
      return false;
    }
  }

  // Create a test webhook URL for demonstration
  createTestWebhookUrl(): string {
    const webhookUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    this.setWebhookUrl(webhookUrl);
    return webhookUrl;
  }
}

export const googleSheetsService = new GoogleSheetsService();