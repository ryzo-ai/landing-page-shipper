'use client'

import { FooterContent } from '../../types/content'

const socialPaths: Record<string, string> = {
  twitter:
    'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.634L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  linkedin:
    'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
  github:
    'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  youtube:
    'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  instagram:
    'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.55 3h8.9A4.55 4.55 0 0121 7.55v8.9A4.55 4.55 0 0116.45 21H7.55A4.55 4.55 0 013 16.45V7.55A4.55 4.55 0 017.55 3z',
}

export default function Footer({ content }: { content: FooterContent }) {
  return (
    <footer className="bg-[#FAF7F4] border-t border-[#2D2926]/10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo */}
          <a href="https://ryzo.nl" target="_blank" rel="noopener noreferrer" aria-label="Ryzo">
            {content.logo.imageSrc ? (
              <img src={content.logo.imageSrc} alt={content.logo.imageAlt ?? content.logo.text} className="h-7 w-auto" />
            ) : (
              <img src="/brand/asset-77.svg" alt="Ryzo" className="h-7 w-auto" />
            )}
          </a>

          {/* Optional nav links */}
          {content.links && content.links.length > 0 && (
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {content.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-geist text-sm text-[#2D2926]/55 hover:text-[#2D2926] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Optional social links */}
          {content.socialLinks && content.socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {content.socialLinks.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="text-[#2D2926]/40 hover:text-[#2D2926] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={socialPaths[s.platform]} />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-[#2D2926]/10">
          <p className="font-geist text-xs text-[#2D2926]/30">{content.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
