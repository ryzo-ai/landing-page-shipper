import type { MetadataRoute } from 'next'

/** Demo deployments must never be indexed. */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', disallow: '/' }] }
}
