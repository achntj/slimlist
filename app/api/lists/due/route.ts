import { NextResponse } from 'next/server';
import { getListsWithDueDates } from '@/lib/database';

export async function GET() {
  try {
    const lists = getListsWithDueDates();
    return NextResponse.json(lists);
  } catch (error) {
    console.error('Error fetching due lists:', error);
    return NextResponse.json({ error: 'Failed to fetch due lists' }, { status: 500 });
  }
}
