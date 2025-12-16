export async function verifyCaptcha(captchaToken: string | null) {
    if (!captchaToken) {
        return { success: false, error: "Captcha mancante" };
    }

    const res = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                secret: process.env.TURNSTILE_SECRET_KEY!,
                response: captchaToken,
            }),
        }
    );

    const captchaResult = await res.json();

    if (!captchaResult.success) {
        return { success: false, error: "Captcha non valido" };
    }

    return { success: true }

}