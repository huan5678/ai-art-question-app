'use server';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

import { env } from '@/env.mjs';
import type { ColumnMapping } from '@/types/quest';

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID as string;
const GOOGLE_SERVICE_PRIVATE_KEY = env.GOOGLE_SERVICE_PRIVATE_KEY as string;
const GOOGLE_SPREADSHEET_ID = env.GOOGLE_SPREADSHEET_ID as string;
const GOOGLE_CLIENT_EMAIL = env.GOOGLE_CLIENT_EMAIL as string;
const GOOGLE_PROJECT_ID = env.GOOGLE_PROJECT_ID as string;
const GOOGLE_SERVICE_PRIVATE_KEY_ID =
  env.GOOGLE_SERVICE_PRIVATE_KEY_ID as string;

const options = {
  projectId: GOOGLE_PROJECT_ID,
  credentials: {
    type: 'service_account',
    product_id: GOOGLE_PROJECT_ID,
    client_email: GOOGLE_CLIENT_EMAIL,
    client_id: GOOGLE_CLIENT_ID,
    private_key_id: GOOGLE_SERVICE_PRIVATE_KEY_ID,
    private_key: GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    universe_domain: 'googleapis.com',
  },
  scopes: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
  ],
};

const columnMapping = {
  id: 'id',
  title: '題目',
  description: '描述',
  category: '題庫',
};

function mapToEnglishKeys(data: [][]): ColumnMapping[] {
  const [header, ...rows] = data;
  const headerMap = header.map((key: string) => {
    for (const [engKey, chiKey] of Object.entries(columnMapping)) {
      if (chiKey === key) {
        return engKey;
      }
    }
    return key;
  });

  return rows.map((row) => {
    const obj: { [key: string]: string } = {};
    row.forEach((value: string, index: number) => {
      const key = headerMap[index];
      if (key === 'id' && (!value || value.trim() === '')) {
        obj[key] = uuidv4();
      } else {
        obj[key] = value;
      }
    });
    return obj;
  });
}

function mapToChineseKeys(data: ColumnMapping[]): string[][] {
  return data.map((item) => {
    return Object.entries(columnMapping).map(([engKey]) => {
      return item[engKey] || '';
    });
  });
}

export async function getSheetData() {
  const glAuth = await google.auth.getClient(options);
  const sheets = google.sheets({ version: 'v4', auth: glAuth });
  const sheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SPREADSHEET_ID,
    range: 'quests',
  });

  const data = sheetData.data.values as [][];
  if (!data) {
    return {
      state: false,
      message: 'Sheet data not found',
      result: null,
    };
  }
  const result = mapToEnglishKeys(data);
  return {
    state: true,
    message: 'Sheet data fetched',
    result,
  };
}

export async function updateSheetData(data: ColumnMapping[]) {
  const glAuth = await google.auth.getClient(options);
  const sheets = google.sheets({ version: 'v4', auth: glAuth });
  const values = [
    Object.values(columnMapping), // 插入標題行
    ...mapToChineseKeys(data),
  ];
  await sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SPREADSHEET_ID,
    range: 'quests',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values,
    },
  });
}
