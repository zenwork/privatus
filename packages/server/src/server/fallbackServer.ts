export async function fallbackServer(reason: Record<string | symbol | number, string>) {
  const server = Deno.listen({ port: 8000 })

  for await (const conn of server) {
    await serveHttp(conn)
  }

  async function serveHttp(conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn)
    for await (const requestEvent of httpConn) {
      const body = JSON.stringify(reason)
      await requestEvent.respondWith(
        new Response(body, {
          status: 200,
        }),
      )
    }
  }
}
