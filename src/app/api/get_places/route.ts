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
      SELECT id, place_name, place_lat, place_long, entry_mode
      FROM places
      WHERE stato=2
    `);

    const now = new Date();
      const getDate = (now.getDay() + 6) % 7;                //Giorno della settimana (0=Lunedì, 6=Domenica)
      const currentMinutes = now.getHours() * 60 + now.getMinutes();      //Prendi l'orario attuale in minuti 
      const customData = result.rows.map(row => {
        const opening = row.place_opening_hours ? row.place_opening_hours[getDate] : null;
        const closing = row.place_closing_hours ? row.place_closing_hours[getDate] : null;
        return {
          id: row.id,
          placeName: row.place_name,
          placeLat: row.place_lat,
          placeLong: row.place_long,
          placeOpeningHours: row.place_opening_hours,
          placeClosingHours: row.place_closing_hours,
          isClosed: opening === null ||
            closing === null ||
            currentMinutes < opening ||
            currentMinutes >= closing,
          entryMode: row.entry_mode,
        };
      });
        console.log("ORARIO ATTUALE IN MINUTI:", currentMinutes); 

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

// TODOs:
// - aperto/chiuso giorni non americani 0 = lunedi

// **VULNERABILE**
// - sistemare con app-check