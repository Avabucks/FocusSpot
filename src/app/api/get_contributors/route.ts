"use server"
import { pool } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const result = await pool.query(`
      SELECT U.username, U.foto_profilo AS "photoURL", COUNT(*) AS "tot"
      FROM places P JOIN users U ON U.uid = P.uid
      WHERE stato=2 AND U.is_admin = 0
      GROUP BY U.username, U.foto_profilo
      ORDER BY tot DESC
    `);

    return NextResponse.json(result.rows, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}