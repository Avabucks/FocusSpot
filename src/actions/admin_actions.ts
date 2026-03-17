"use server"
import { pool } from "@/src/lib/db";

export async function checkAdmin(uid: string) {

  const result = await pool.query(
    `SELECT uid FROM users WHERE is_admin=1`
  );

  const isAdmin = result.rows.some(row => row.uid === uid);

  return isAdmin;
}

export async function listAdmin(searchString: string, stato: number) {
  let result;

  if (searchString && searchString.trim() !== "") {
    result = await pool.query(
      `SELECT id, place_name AS "placeName", similarity(place_name, $2) AS similarity
      FROM places
      WHERE stato = $1
      ORDER BY similarity DESC, data_accettazione DESC, id DESC
      LIMIT 50`,
      [stato, searchString]
    );
  } else {
    result = await pool.query(
      `SELECT id, place_name AS "placeName"
      FROM places
      WHERE stato = $1
      ORDER BY data_accettazione DESC, id DESC`,
      [stato]
    );
  }

  return result.rows;
}