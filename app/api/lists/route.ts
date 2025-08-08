import { NextResponse } from 'next/server';
import { getAllLists } from '@/lib/database';

export async function GET() {
  try {
    const lists = getAllLists();
    return NextResponse.json(lists);
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
  }
}
