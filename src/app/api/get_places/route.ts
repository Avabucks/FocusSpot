"use server"
import { pool } from '@/src/lib/db';
import { NextResponse } from 'next/server';
import tzlookup from "tz-lookup";

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

    const customData = result.rows.map(row => {
      const timeZone = tzlookup(row.place_lat, row.place_long);
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        weekday: "short",
        hour12: false
      }).formatToParts(now);

      const hourPart = parts.find(p => p.type === "hour");
      const hour = hourPart ? Number(hourPart.value) : 0;

      const minutePart = parts.find(p => p.type === "minute");
      const minute = minutePart ? Number(minutePart.value) : 0;

      const weekdayPart = parts.find(p => p.type === "weekday");
      const weekdayStr = weekdayPart?.value ?? "Mon";

      const weekdayMap: Record<string, number> = {
        "Mon": 0,
        "Tue": 1,
        "Wed": 2,
        "Thu": 3,
        "Fri": 4,
        "Sat": 5,
        "Sun": 6
      };

      const weekday = weekdayMap[weekdayStr];
      const currentMinutes = hour * 60 + minute;

      const openingMinutes = timeToMinutes(row.openingHours[weekday].openTime);
      const closingMinutes = timeToMinutes(row.openingHours[weekday].closeTime);
      const isOvernight = closingMinutes < openingMinutes;
      const isOpen =
        row.openingHours[weekday].isOpen &&
        (
          (!isOvernight &&
            currentMinutes >= openingMinutes &&
            currentMinutes <= closingMinutes
          ) ||
          (isOvernight &&
            (currentMinutes >= openingMinutes ||
              currentMinutes <= closingMinutes)
          )
        );

      return {
        id: row.id,
        placeName: row.place_name,
        placeLat: row.place_lat,
        placeLong: row.place_long,
        isOpen: isOpen,
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