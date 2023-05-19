import { RouterContext } from 'https://deno.land/x/oak@v12.1.0/router.ts'

export function healthcheck(ctx: RouterContext<any, any, any>) {
  ctx.response.body = { status: 'OK' }
}
