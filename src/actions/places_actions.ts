"use server"
import { pool } from "@/src/lib/db";
import { sendEmail } from "../utils/send_mail";
import { verifyCaptcha } from "../utils/verify_captcha";

export async function aggiungiLuogo(id: any, user: any, formData: any, openingHours: any, captchaToken: string | null) {

    if (user.isAdmin == 0) {
        const verify = await verifyCaptcha(captchaToken)
        if (!verify.success) return verify;
    }

    const stato = user.isAdmin ? 2 : 0;

    if (!user) return { success: false, error: "Utente non esistente" };

    let result;
    if (id == "new") {

        result = await pool.query(
            `INSERT INTO places (
                place_name,
                place_description,
                place_lat,
                place_long,
                entry_mode,
                has_free_wifi,
                has_power_sockets,
                has_air,
                has_heating,
                has_smart,
                has_silence,
                has_disabled_access,
                uid,
                stato,
                data_accettazione,
                opening_hours
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
            [
                formData.placeName,
                formData.description,
                formData.placeLat,
                formData.placeLong,
                formData.entryMode,
                formData.hasFreeWifi,
                formData.hasPowerSockets,
                formData.hasAir,
                formData.hasHeating,
                formData.hasSmart,
                formData.hasSilence,
                formData.hasDisabledAccess,
                user.uid,
                stato,
                new Date(),
                JSON.stringify(openingHours)
            ]
        );

    } else if (user.isModerator == 1) {

        result = await pool.query(
            `UPDATE places
            SET
                place_name = $1,
                place_description = $2,
                place_lat = $3,
                place_long = $4,
                entry_mode = $5,
                has_free_wifi = $6,
                has_power_sockets = $7,
                has_air = $8,
                has_heating = $9,
                has_smart = $10,
                has_silence = $11,
                has_disabled_access = $12,
                stato = $13,
                data_accettazione = $14,
                opening_hours = $15
            WHERE id = $16`,
            [
                formData.placeName,
                formData.description,
                formData.placeLat,
                formData.placeLong,
                formData.entryMode,
                formData.hasFreeWifi,
                formData.hasPowerSockets,
                formData.hasAir,
                formData.hasHeating,
                formData.hasSmart,
                formData.hasSilence,
                formData.hasDisabledAccess,
                stato,
                new Date(),
                JSON.stringify(openingHours),
                id
            ]
        );

    }

    if (result) {
        if (user.isAdmin == 0) {
            const sended = await sendEmail({
                to: "avabuckssociety@gmail.com",
                subject: "Richiesta di accettazione spazio studio",
                html: `
                    <div>
                        <p>Utente: ${user.username}</p>
                        <p>Luogo: ${formData.placeName}</p>
                    </div>
                    `
            });
            return { success: sended.success || true };
        } else {
            return { success: true };
        }
    } else {
        return { success: false, error: "Errore del database" };
    }

}

export async function getPlaceFromId(id: any) {
    const result = await pool.query(
        `SELECT 
            place_name,
            place_description,
            place_lat,
            place_long,
            entry_mode,
            has_free_wifi,
            has_power_sockets,
            has_air,
            has_heating,
            has_smart,
            has_silence,
            has_disabled_access,
            opening_hours
         FROM places
         WHERE id = $1`,
        [id]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];

    return {
        formData: {
            placeName: row.place_name,
            description: row.place_description,
            placeLat: row.place_lat,
            placeLong: row.place_long,
            entryMode: row.entry_mode,
            hasFreeWifi: row.has_free_wifi,
            hasPowerSockets: row.has_power_sockets,
            hasAir: row.has_air,
            hasHeating: row.has_heating,
            hasSmart: row.has_smart,
            hasSilence: row.has_silence,
            hasDisabledAccess: row.has_disabled_access,
        },
        openingHours: row.opening_hours
    };
}

export async function deleteLuogo(id: any) {

    try {
        const result = await pool.query(
            'UPDATE places SET stato = 1 WHERE id = $1',
            [id]
        );
        return result.rowCount;
    } catch (err) {
        console.error(err);
        return false;
    }

}

export async function mailContact(formData: any, captchaToken: string | null) {
    const verify = await verifyCaptcha(captchaToken)
    if (!verify.success) return verify;

    const sended = await sendEmail({
        to: "avabuckssociety@gmail.com",
        subject: formData.oggetto,
        html: `
            <div>
                <p>Email: ${formData.email}</p>
                ${formData.placeName ? `<p>Luogo d'interesse: ${formData.placeName}</p>` : ""}
                <p>Testo: ${formData.testo}</p>
            </div>
            `
    });
    return { success: sended.success };
}