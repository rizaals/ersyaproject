// Helper untuk publish LP ke VPS subdomain server

export async function publishToSubdomain(
  slug: string,
  htmlFiles: Record<string, string> // { 'index.html': '<html>...', 'about.html': '...' }
): Promise<{ url: string }> {
  const response = await fetch(`${process.env.SUBDOMAIN_SERVER_URL}/deploy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Secret': process.env.SUBDOMAIN_SERVER_SECRET!,
    },
    body: JSON.stringify({ slug: slug.toLowerCase(), htmlFiles }),
  })

  if (!response.ok) {
    throw new Error(`Subdomain publish failed: ${response.statusText}`)
  }

  const data = await response.json()
  return { url: `https://${slug.toLowerCase()}.${process.env.NEXT_PUBLIC_PREVIEW_DOMAIN}` }
}

export async function deleteSubdomain(slug: string): Promise<void> {
  await fetch(`${process.env.SUBDOMAIN_SERVER_URL}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Secret': process.env.SUBDOMAIN_SERVER_SECRET!,
    },
    body: JSON.stringify({ slug: slug.toLowerCase() }),
  })
}
