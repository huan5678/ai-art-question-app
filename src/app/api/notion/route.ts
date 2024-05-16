import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_DB_SECRET,
});

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DB_ID as string,
    });
    console.log('response:', response);
    return NextResponse.json({
      message: 'Data fetched',
      status: true,
      data: response,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch data', status: false },
      { status: 500 }
    );
  }
}
