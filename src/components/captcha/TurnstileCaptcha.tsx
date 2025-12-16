'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

export default function TurnstileCaptcha({
  onVerify,
}: {
  onVerify: (token: string) => void;
}) {
  const callbackName = useRef(`turnstileCallback_${Math.random().toString(36).substring(7)}`);

  useEffect(() => {
    // Create global callback function
    (globalThis as any)[callbackName.current] = onVerify;

    // Cleanup on unmount
    return () => {
      delete (globalThis as any)[callbackName.current];
    };
  }, [onVerify]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
      <div
        className="cf-turnstile"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        data-callback={callbackName.current}
      />
    </>
  );
}