/**
 * Fallback response that provides a single answer to all requests. Intended as a way to report back any start-up error since deploy
 * provides no feedback in logs when test deployment fails
 * @param reason
 */
export async function fallbackServer(reason: Record<string | symbol | number, unknown>) {
  console.warn('SERVING FROM FALLBACK')
  const server = Deno.listen({ port: 8000 })

  for await (const conn of server) {
    await serveHttp(conn)
  }

  async function serveHttp(conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn)
    for await (const requestEvent of httpConn) {
      const body = JSON
        .stringify(reason)
        .replaceAll(/[{}]/g, '\n')
        .replaceAll(/":"/g, '":\n"')
        .replaceAll(/\\n/g, '\n')
        .replaceAll(/","/g, '"\n\n"')
        .replaceAll(/"/g, '')
      await requestEvent.respondWith(
        new Response(body, {
          status: 500,
        }),
      )
    }
  }
}

export async function continueIfDir(path: string) {
  try {
    const fileInfo = await Deno.stat(path)
    if (!fileInfo.isDirectory) throw new Error(`[${path}] is not a directory`)
  } catch (e) {
    throw new Error(`Can not continue with ${path} [cause: ${e.message}]`, { cause: e })
  }
}
