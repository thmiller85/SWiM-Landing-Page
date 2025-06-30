import { google } from 'googleapis';
import type { Lead } from '@shared/schema';

interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  serviceAccountEmail: string;
  privateKey: string;
}

export class GoogleSheetsService {
  private sheets: any;
  private config: GoogleSheetsConfig;

  constructor() {
    // Initialize with environment variables
    this.config = {
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '',
      sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || 'Leads',
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
      privateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    };

    this.initializeAuth();
  }

  private initializeAuth() {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: this.config.serviceAccountEmail,
          private_key: this.config.privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
    } catch (error) {
      console.error('Google Sheets authentication failed:', error);
    }
  }

  async ensureHeaders(): Promise<void> {
    if (!this.isConfigured()) {
      console.log('Google Sheets not configured, skipping header setup');
      return;
    }

    try {
      const headers = [
        'Timestamp',
        'First Name',
        'Last Name',
        'Email',
        'Company',
        'Industry',
        'Company Size',
        'Phone',
        'Lead Source',
        'Lead Score',
        'ROI Projection',
        'Monthly Revenue Increase',
        'Implementation Cost',
        'Assessment Priority',
        'Post Title',
        'Status',
        'Notes'
      ];

      // Check if headers exist
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheetId,
        range: `${this.config.sheetName}!1:1`,
      });

      if (!response.data.values || response.data.values.length === 0) {
        // Add headers
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.config.spreadsheetId,
          range: `${this.config.sheetName}!1:1`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [headers],
          },
        });
        console.log('Headers added to Google Sheet');
      }
    } catch (error) {
      console.error('Error ensuring headers:', error);
    }
  }

  async addLead(lead: Lead, postTitle?: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.log('Google Sheets not configured, skipping lead addition');
      return false;
    }

    try {
      // Parse interaction data for specific fields
      const interactionData = lead.interactionData as any || {};
      
      // Extract ROI Calculator data
      const roiProjection = interactionData.roiPercentage 
        ? `${interactionData.roiPercentage.toFixed(1)}%` 
        : '';
      const revenueIncrease = interactionData.revenueIncrease 
        ? `$${Math.round(interactionData.revenueIncrease).toLocaleString()}` 
        : '';
      const implementationCost = interactionData.implementationCost 
        ? `$${Math.round(interactionData.implementationCost).toLocaleString()}` 
        : '';

      // Extract Assessment data
      const assessmentPriority = interactionData.priorityLevel || '';

      const rowData = [
        new Date(lead.createdAt).toLocaleString(),
        lead.firstName || '',
        lead.lastName || '',
        lead.email,
        lead.company || '',
        lead.industry || '',
        lead.companySize || '',
        lead.phone || '',
        lead.leadSource,
        lead.leadScore || 0,
        roiProjection,
        revenueIncrease,
        implementationCost,
        assessmentPriority,
        postTitle || '',
        lead.status || 'new',
        lead.notes || ''
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.config.spreadsheetId,
        range: `${this.config.sheetName}!A:Q`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [rowData],
        },
      });

      console.log(`Lead added to Google Sheet: ${lead.email}`);
      return true;
    } catch (error) {
      console.error('Error adding lead to Google Sheet:', error);
      return false;
    }
  }

  async updateLeadStatus(email: string, status: string, notes?: string): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      // Find the row with this email
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheetId,
        range: `${this.config.sheetName}!A:Q`,
      });

      const rows = response.data.values || [];
      for (let i = 1; i < rows.length; i++) { // Skip header row
        if (rows[i][3] === email) { // Email is in column D (index 3)
          // Update status (column P, index 15) and notes (column Q, index 16)
          await this.sheets.spreadsheets.values.update({
            spreadsheetId: this.config.spreadsheetId,
            range: `${this.config.sheetName}!P${i + 1}:Q${i + 1}`,
            valueInputOption: 'USER_ENTERED',
            resource: {
              values: [[status, notes || rows[i][16] || '']],
            },
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error updating lead status:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    return !!(
      this.config.spreadsheetId &&
      this.config.serviceAccountEmail &&
      this.config.privateKey
    );
  }

  getSetupInstructions(): string {
    return `
Google Sheets Setup Instructions:

1. Create a Google Cloud Project:
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing

2. Enable Google Sheets API:
   - Go to APIs & Services > Library
   - Search for "Google Sheets API" and enable it

3. Create Service Account:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "Service Account"
   - Download the JSON key file

4. Create Google Sheet:
   - Create a new Google Sheet
   - Share it with your service account email (from step 3)
   - Copy the Sheet ID from the URL

5. Set Environment Variables:
   GOOGLE_SHEETS_SPREADSHEET_ID=your_sheet_id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
   GOOGLE_PRIVATE_KEY=your_private_key
   GOOGLE_SHEETS_SHEET_NAME=Leads

The system will automatically create headers and start logging leads!
    `;
  }
}

export const googleSheetsService = new GoogleSheetsService();