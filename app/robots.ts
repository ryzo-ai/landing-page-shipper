import type { MetadataRoute } from 'next'

// Demo deploy: disallow all crawling.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', disallow: '/' }],
  }
}
