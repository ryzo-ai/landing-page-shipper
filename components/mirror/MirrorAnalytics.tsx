'use client'

import Script from 'next/script'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-5JXNDXF'
const HUBSPOT_PORTAL = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '48282941'

/**
 * GloPros' own GTM container. It loads Cookiebot (GTM implementation, Consent Mode v2), GA4 via
 * the Stape server container and the ads pixels — the same stack as glopros.ai, so the LPs
 * inherit their consent handling. HubSpot tracking (hubspotutk for form attribution) loads only
 * after Cookiebot reports statistics or marketing consent.
 */
export default function MirrorAnalytics() {
  return (
    <>
      <Script id="gp-gtm" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}</Script>
      <Script id="gp-hubspot-after-consent" strategy="afterInteractive">{`
        (function(){
          var loaded = false;
          function load(){
            if (loaded) return; loaded = true;
            var s = document.createElement('script');
            s.id = 'hs-script-loader'; s.async = true; s.defer = true;
            s.src = 'https://js.hs-scripts.com/${HUBSPOT_PORTAL}.js';
            document.body.appendChild(s);
          }
          function check(){
            var c = window.Cookiebot && window.Cookiebot.consent;
            if (c && (c.statistics || c.marketing)) load();
          }
          window.addEventListener('CookiebotOnAccept', check);
          window.addEventListener('CookiebotOnConsentReady', check);
          check();
        })();
      `}</Script>
    </>
  )
}
