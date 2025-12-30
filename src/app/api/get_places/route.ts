"use server"
import { pool } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, x-bearer-key',
    },
  });
}

export async function GET(request: Request) {
  if (request.headers.get('x-bearer-key') !== process.env.BEARER_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  try {
    const result = await pool.query(`
      SELECT id, place_name, place_lat, place_long, entry_mode, opening_hours as "openingHours"
      FROM places
      WHERE stato=2
    `);

    const now = new Date();
    const getDate = (now.getDay() + 6) % 7;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const customData = result.rows.map(row => {
      const openingMinutes = timeToMinutes(row.openingHours[getDate].openTime);
      const closingMinutes = timeToMinutes(row.openingHours[getDate].closeTime);
      return {
        id: row.id,
        placeName: row.place_name,
        placeLat: row.place_lat,
        placeLong: row.place_long,
        isOpen: row.openingHours[getDate].isOpen && (currentMinutes >= openingMinutes && currentMinutes <= closingMinutes),
        entryMode: row.entry_mode
      };
    });

    return NextResponse.json(customData, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

const timeToMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// **VULNERABILE**
// - sistemare con app-check