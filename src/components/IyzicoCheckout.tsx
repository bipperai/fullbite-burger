"use client";

import { useEffect, useRef } from "react";

export function IyzicoCheckout({ html, paymentPageUrl }: { html: string; paymentPageUrl?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.innerHTML = html;
    host.querySelectorAll("script").forEach((oldScript) => {
      const script = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        script.setAttribute(attr.name, attr.value);
      });
      script.textContent = oldScript.textContent;
      oldScript.replaceWith(script);
    });
  }, [html]);

  return (
    <div className="overflow-hidden rounded-3xl bg-white p-4">
      <div id="iyzipay-checkout-form" className="responsive" />
      <div ref={ref} />
      {paymentPageUrl ? (
        <p className="mt-4 text-center text-sm text-neutral-600">
          Form görünmezse{" "}
          <a className="underline" href={paymentPageUrl}>
            iyzico ödeme sayfasına git
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}
