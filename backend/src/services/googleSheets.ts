import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

class GoogleSheetsService {
  private sheets: any;
  private spreadsheetId: string;
  private isInitialized: boolean = false;
  private initializationError: string | null = null;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || '';
    this.init();
  }

  private async init() {
    try {
      // Validate required environment variables
      if (!process.env.GOOGLE_SPREADSHEET_ID) {
        throw new Error('GOOGLE_SPREADSHEET_ID environment variable is required');
      }
      
      if (!process.env.GOOGLE_CLIENT_EMAIL) {
        throw new Error('GOOGLE_CLIENT_EMAIL environment variable is required');
      }
      
      if (!process.env.GOOGLE_PRIVATE_KEY) {
        throw new Error('GOOGLE_PRIVATE_KEY environment variable is required');
      }

      // 使用服務帳戶認證
      const auth = new JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.isInitialized = true;
      this.initializationError = null;
      
      console.log('Google Sheets service initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
      this.initializationError = errorMessage;
      this.isInitialized = false;
      
      console.error('Google Sheets initialization error:', errorMessage);
      console.warn('Google Sheets service will operate in fallback mode - data will not be persisted');
    }
  }

  // Check if service is available
  private checkServiceAvailability(): boolean {
    if (!this.isInitialized) {
      console.warn(`Google Sheets service not initialized: ${this.initializationError}`);
      return false;
    }
    return true;
  }

  // 讀取資料
  async readData(range: string) {
    try {
      if (!this.checkServiceAvailability()) {
        console.warn(`Google Sheets readData fallback: returning empty array for range ${range}`);
        return [];
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });
      return response.data.values || [];
    } catch (error) {
      console.error('Error reading data from Google Sheets:', error);
      console.warn(`Fallback: returning empty array for range ${range}`);
      return []; // Return empty array as fallback
    }
  }

  // 寫入資料
  async writeData(range: string, values: any[][]) {
    try {
      if (!this.checkServiceAvailability()) {
        console.warn(`Google Sheets writeData fallback: data not persisted for range ${range}`);
        return { updatedCells: 0, updatedColumns: 0, updatedRows: 0 }; // Mock response
      }

      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error writing data to Google Sheets:', error);
      console.warn(`Fallback: data not persisted for range ${range}`);
      return { updatedCells: 0, updatedColumns: 0, updatedRows: 0 }; // Mock response as fallback
    }
  }

  // 新增資料到表格末尾
  async appendData(range: string, values: any[][]) {
    try {
      if (!this.checkServiceAvailability()) {
        console.warn(`Google Sheets appendData fallback: data not persisted for range ${range}`);
        return { updates: { updatedCells: 0, updatedColumns: 0, updatedRows: 0 } }; // Mock response
      }

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error appending data to Google Sheets:', error);
      console.warn(`Fallback: data not persisted for range ${range}`);
      return { updates: { updatedCells: 0, updatedColumns: 0, updatedRows: 0 } }; // Mock response as fallback
    }
  }

  // 清空範圍資料
  async clearData(range: string) {
    try {
      if (!this.checkServiceAvailability()) {
        console.warn(`Google Sheets clearData fallback: data not cleared for range ${range}`);
        return { clearedRange: range }; // Mock response
      }

      const response = await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range,
      });
      return response.data;
    } catch (error) {
      console.error('Error clearing data from Google Sheets:', error);
      console.warn(`Fallback: data not cleared for range ${range}`);
      return { clearedRange: range }; // Mock response as fallback
    }
  }

  // Get service status
  getServiceStatus() {
    return {
      isInitialized: this.isInitialized,
      initializationError: this.initializationError,
      spreadsheetId: this.spreadsheetId
    };
  }

  // Manually retry initialization
  async retryInitialization() {
    console.log('Retrying Google Sheets initialization...');
    await this.init();
    return this.getServiceStatus();
  }
}

export default new GoogleSheetsService();