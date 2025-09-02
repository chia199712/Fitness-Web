const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
require('dotenv').config();

/**
 * Google Sheets Database Structure Initialization Script
 * 
 * This script creates the required worksheets and headers for the fitness app
 * according to the technical specifications in the requirements.
 * 
 * Worksheets Structure:
 * 1. Users - User account information
 * 2. Exercises - Exercise library (system and custom exercises)
 * 3. Workouts - Workout records
 * 4. WorkoutExercises - Exercises within workouts
 * 5. Sets - Individual sets data
 * 6. Templates - Workout templates
 * 7. TemplateExercises - Exercises within templates
 * 8. UserSettings - User preferences and settings
 */

class GoogleSheetsInitializer {
  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    this.auth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async initialize() {
    try {
      console.log('Starting Google Sheets database initialization...');
      
      // Define the worksheet structures
      const worksheets = [
        {
          title: 'Users',
          headers: [
            'user_id',
            'email', 
            'name',
            'password_hash',
            'created_at',
            'updated_at'
          ]
        },
        {
          title: 'Exercises',
          headers: [
            'exercise_id',
            'name',
            'category',
            'muscle_groups',
            'equipment',
            'instructions',
            'video_url',
            'image_url',
            'is_system',
            'user_id',
            'created_at'
          ]
        },
        {
          title: 'Workouts',
          headers: [
            'workout_id',
            'user_id',
            'name',
            'date',
            'duration',
            'total_volume',
            'notes',
            'template_id',
            'created_at',
            'updated_at'
          ]
        },
        {
          title: 'WorkoutExercises',
          headers: [
            'workout_exercise_id',
            'workout_id',
            'exercise_id',
            'order',
            'created_at'
          ]
        },
        {
          title: 'Sets',
          headers: [
            'set_id',
            'workout_exercise_id',
            'set_number',
            'weight',
            'reps',
            'duration',
            'distance',
            'rest_time',
            'completed',
            'notes',
            'created_at'
          ]
        },
        {
          title: 'Templates',
          headers: [
            'template_id',
            'user_id',
            'name',
            'description',
            'category',
            'is_public',
            'created_at',
            'updated_at'
          ]
        },
        {
          title: 'TemplateExercises',
          headers: [
            'template_exercise_id',
            'template_id',
            'exercise_id',
            'order',
            'target_sets',
            'target_reps',
            'target_weight',
            'created_at'
          ]
        },
        {
          title: 'UserSettings',
          headers: [
            'user_id',
            'theme',
            'language',
            'units',
            'default_rest_time',
            'notifications_workout_reminders',
            'notifications_progress_updates',
            'notifications_achievements',
            'privacy_profile_visible',
            'privacy_workouts_visible',
            'privacy_stats_visible',
            'updated_at'
          ]
        }
      ];

      // Get existing sheets
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId
      });

      const existingSheets = spreadsheet.data.sheets?.map(sheet => sheet.properties?.title) || [];
      console.log('Existing sheets:', existingSheets);

      // Create missing worksheets
      for (const worksheet of worksheets) {
        if (!existingSheets.includes(worksheet.title)) {
          console.log(`Creating worksheet: ${worksheet.title}`);
          await this.createWorksheet(worksheet.title, worksheet.headers);
        } else {
          console.log(`Worksheet already exists: ${worksheet.title}`);
          // Optionally update headers if they don't match
          await this.updateHeaders(worksheet.title, worksheet.headers);
        }
      }

      // Initialize system exercises
      await this.initializeSystemExercises();

      console.log('Google Sheets database initialization completed successfully!');
    } catch (error) {
      console.error('Error initializing Google Sheets database:', error);
      throw error;
    }
  }

  async createWorksheet(title, headers) {
    try {
      // Add the new worksheet
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [{
            addSheet: {
              properties: {
                title: title
              }
            }
          }]
        }
      });

      // Add headers to the new worksheet
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${title}!A1:${String.fromCharCode(64 + headers.length)}1`,
        valueInputOption: 'RAW',
        resource: {
          values: [headers]
        }
      });

      console.log(`Successfully created worksheet: ${title}`);
    } catch (error) {
      console.error(`Error creating worksheet ${title}:`, error);
      throw error;
    }
  }

  async updateHeaders(title, headers) {
    try {
      // Check current headers
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${title}!A1:Z1`
      });

      const currentHeaders = response.data.values?.[0] || [];
      
      // Only update if headers are different
      if (JSON.stringify(currentHeaders) !== JSON.stringify(headers)) {
        console.log(`Updating headers for worksheet: ${title}`);
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${title}!A1:${String.fromCharCode(64 + headers.length)}1`,
          valueInputOption: 'RAW',
          resource: {
            values: [headers]
          }
        });
      }
    } catch (error) {
      console.error(`Error updating headers for ${title}:`, error);
    }
  }

  async initializeSystemExercises() {
    try {
      console.log('Initializing system exercises...');
      
      // Check if exercises already exist
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Exercises!A:A'
      });

      const existingData = response.data.values || [];
      if (existingData.length > 1) {
        console.log('System exercises already initialized');
        return;
      }

      // System exercises data based on common fitness exercises
      const systemExercises = [
        ['ex_001', '深蹲', '腿部', '股四頭肌,臀部,核心', '無', '雙腳與肩同寬站立，下蹲直到大腿與地面平行，然後回到起始位置', '', '', 'true', '', new Date().toISOString()],
        ['ex_002', '臥推', '胸部', '胸大肌,三頭肌,前三角肌', '槓鈴,臥推椅', '仰臥在臥推椅上，雙手握槓鈴，將槓鈴推向胸部上方', '', '', 'true', '', new Date().toISOString()],
        ['ex_003', '引體向上', '背部', '背闊肌,二頭肌,後三角肌', '單槓', '握住單槓，身體懸空，拉起身體直到下巴超過單槓', '', '', 'true', '', new Date().toISOString()],
        ['ex_004', '硬舉', '背部', '下背部,臀部,大腿後側', '槓鈴', '雙腳與肩同寬，彎腰抓住槓鈴，直立身體將槓鈴拉起', '', '', 'true', '', new Date().toISOString()],
        ['ex_005', '肩上推舉', '肩部', '前三角肌,中三角肌,三頭肌', '啞鈴', '雙手持啞鈴在肩膀高度，向上推舉至手臂伸直', '', '', 'true', '', new Date().toISOString()],
        ['ex_006', '二頭彎舉', '手臂', '二頭肌', '啞鈴', '雙手持啞鈴垂在身體兩側，彎曲手肘將啞鈴舉至肩膀高度', '', '', 'true', '', new Date().toISOString()],
        ['ex_007', '三頭伸展', '手臂', '三頭肌', '啞鈴', '單手持啞鈴在頭頂，彎曲手肘將啞鈴降至腦後，然後回到起始位置', '', '', 'true', '', new Date().toISOString()],
        ['ex_008', '平板支撐', '核心', '腹肌,核心,背部', '無', '俯臥撐姿勢，用前臂支撐身體，保持身體呈直線', '', '', 'true', '', new Date().toISOString()],
        ['ex_009', '仰臥起坐', '核心', '腹肌', '無', '仰臥，雙腳固定，手放在頭後，起身至坐姿', '', '', 'true', '', new Date().toISOString()],
        ['ex_010', '跑步', '有氧', '全身,心肺', '跑步機', '保持穩定節奏的跑步運動', '', '', 'true', '', new Date().toISOString()],
        ['ex_011', '弓步蹲', '腿部', '股四頭肌,臀部', '無', '一腳向前跨步，降低身體直到前腿彎曲90度', '', '', 'true', '', new Date().toISOString()],
        ['ex_012', '側平舉', '肩部', '中三角肌', '啞鈴', '雙手持啞鈴在身體兩側，側向舉起至肩膀高度', '', '', 'true', '', new Date().toISOString()],
        ['ex_013', '划船', '背部', '背闊肌,菱形肌,二頭肌', '啞鈴', '彎腰持啞鈴，將啞鈴拉向腹部', '', '', 'true', '', new Date().toISOString()],
        ['ex_014', '腿舉', '腿部', '股四頭肌,臀部', '腿舉機', '坐在腿舉機上，用腿推動重量板', '', '', 'true', '', new Date().toISOString()],
        ['ex_015', '俯臥撑', '胸部', '胸大肌,三頭肌,前三角肌', '無', '俯臥撐姿勢，降低身體至胸部接近地面，然後推起', '', '', 'true', '', new Date().toISOString()]
      ];

      // Add system exercises to the sheet
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Exercises!A:K',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: systemExercises
        }
      });

      console.log(`Successfully initialized ${systemExercises.length} system exercises`);
    } catch (error) {
      console.error('Error initializing system exercises:', error);
    }
  }
}

// Main execution function
async function main() {
  try {
    if (!process.env.GOOGLE_SPREADSHEET_ID) {
      throw new Error('GOOGLE_SPREADSHEET_ID environment variable is not set');
    }

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('Google service account credentials are not set');
    }

    const initializer = new GoogleSheetsInitializer();
    await initializer.initialize();
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = GoogleSheetsInitializer;