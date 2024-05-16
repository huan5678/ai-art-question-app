import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_DB_SECRET as string,
});

export async function GET() {
  try {
    const databaseId = process.env.NOTION_DB_ID as string;
    if (!databaseId) {
      return NextResponse.json(
        { message: 'Database ID is missing', status: false },
        { status: 500 }
      );
    }
    const dbStatus = await notion.databases.retrieve({
      database_id: databaseId,
    });
    const data = await notion.databases.query({
      database_id: databaseId,
    });
    console.log('data:', data);
    return NextResponse.json({
      message: 'Data fetched',
      status: true,
      databaseStatus: dbStatus,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch data', status: false },
      { status: 500 }
    );
  }
}
