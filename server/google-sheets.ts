import { google } from 'googleapis';
import type { Lead } from '@shared/schema';

interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export class GoogleSheetsService {
  private sheets: any;
  private config: GoogleSheetsConfig;
  private oauth2Client: any;

  constructor() {
    // Initialize with environment variables
    this.config = {
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '',
      sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || 'Leads',
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN || '',
    };

    this.initializeAuth();
  }

  private initializeAuth() {
    try {
      this.oauth2Client = new google.auth.OAuth2(
        this.config.clientId,
        this.config.clientSecret,
        'http://localhost:5000/auth/google/callback' // This can be any valid URL for server-to-server
      );

      if (this.config.refreshToken) {
        this.oauth2Client.setCredentials({
          refresh_token: this.config.refreshToken,
        });
      }

      this.sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });
    } catch (error) {
      console.error('Google Sheets authentication failed:', error);
    }
  }

  // Generate OAuth URL for initial setup
  generateAuthUrl(): string {
    const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Forces refresh token generation
    });
  }

  // Exchange authorization code for tokens
  async getTokensFromCode(code: string): Promise<any> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      return tokens;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw error;
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
      this.config.clientId &&
      this.config.clientSecret &&
      this.config.refreshToken
    );
  }

  getSetupInstructions(): string {
    return `
Google Sheets OAuth Setup Instructions:

1. Create Google Cloud Project:
   - Go to https://console.cloud.google.com/
   - Create a new project

2. Enable Google Sheets API:
   - Go to APIs & Services > Library
   - Search for "Google Sheets API" and enable it

3. Create OAuth 2.0 Credentials:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Add authorized redirect URI: http://localhost:5000/auth/google/callback

4. Get OAuth URL:
   - Visit /api/google-sheets/auth-url to get the authorization URL
   - Complete OAuth flow to get refresh token

5. Set Environment Variables:
   GOOGLE_SPREADSHEET_ID=your_sheet_id
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REFRESH_TOKEN=your_refresh_token

The system will automatically create headers and start logging leads!
    `;
  }
}

export const googleSheetsService = new GoogleSheetsService();