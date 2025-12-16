'use client';

import { useEffect, useRef, useState } from 'react';

export default function TurnstileCaptcha({
  onVerify,
}: Readonly<{
  onVerify: (token: string) => void;
}>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const [mounted, setMounted] = useState(false);
  const isRendering = useRef(false);

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || isRendering.current) return;

    const loadScript = () => {
      return new Promise<void>((resolve) => {
        if ((globalThis as any).turnstile) {
          resolve();
          return;
        }

        const existingScript = document.querySelector(
          'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
        );

        if (existingScript) {
          const checkLoaded = setInterval(() => {
            if ((globalThis as any).turnstile) {
              clearInterval(checkLoaded);
              resolve();
            }
          }, 100);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    const renderWidget = async () => {
      if (isRendering.current) return;
      isRendering.current = true;

      await loadScript();

      const turnstile = (globalThis as any).turnstile;
      if (!turnstile || !containerRef.current) {
        isRendering.current = false;
        return;
      }

      if (widgetId.current !== null) {
        try {
          turnstile.reset(widgetId.current);
          isRendering.current = false;
          return;
        } catch (e) {
          console.error('Errore reset widget:', e);
          widgetId.current = null;
        }
      }

      if (widgetId.current === null) {
        containerRef.current?.replaceChildren();
        try {
          widgetId.current = turnstile.render(containerRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            callback: (token: string) => onVerifyRef.current(token),
            theme: 'light',
            size: 'normal',
            'refresh-expired': 'auto',
            'response-field': false,
          });
        } catch (e) {
          console.error('Errore render Turnstile:', e);
        }
      }

      isRendering.current = false;
    };

    renderWidget();
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return <div
    ref={containerRef}
    style={{
      position: 'relative',
      isolation: 'isolate',
      WebkitTransform: 'translateZ(0)',
      transform: 'translateZ(0)',
    }} />;
}