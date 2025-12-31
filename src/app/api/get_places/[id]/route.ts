"use server"
import { pool } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const result = await pool.query(
      `
      SELECT
          P.place_name,
          P.place_description,
          P.place_lat,
          P.place_long,
          P.entry_mode,
          P.has_free_wifi,
          P.has_power_sockets,
          P.has_air,
          P.has_heating,
          P.has_smart,
          P.has_silence,
          P.has_disabled_access,
          P.opening_hours,
          U.username
      FROM places P
      JOIN users U ON P.uid = U.uid
      WHERE P.stato = 2 AND P.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }

    const row = result.rows[0];

    const place = {
      id: row.id,
      placeName: row.place_name,
      description: row.place_description,
      placeLat: row.place_lat,
      placeLong: row.place_long,
      isClosed: false,
      entryMode: row.entry_mode,
      hasFreeWifi: row.has_free_wifi,
      hasPowerSockets: row.has_power_sockets,
      hasAir: row.has_air,
      hasHeating: row.has_heating,
      hasSmart: row.has_smart,
      hasSilence: row.has_silence,
      hasDisabledAccess: row.has_disabled_access,
      username: row.username
    };

    const customData = {
      place: place,
      openingHours: row.opening_hours,
    }

    return NextResponse.json(customData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// **VULNERABILE**
// - sistemare con app-check