import juice from 'juice'

export function inlineEmailCss(html: string): string {
  return juice(html, {
    removeStyleTags: true,
    preserveMediaQueries: true,
    applyAttributesTableElements: true,
    webResources: {
      relativeTo: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    },
  })
}
