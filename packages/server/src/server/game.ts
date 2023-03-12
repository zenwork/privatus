import {RouterContext, ServerSentEvent} from 'oak'

export function register(id: { game: any; role: any; player: any }, ctx: RouterContext<any, any, any>) {
    console.log(`setting up SSE for ${id.game} - ${id.player} (${id.role})`)
    const target = ctx.sendEvents()
    setInterval(() => {
        target.dispatchEvent(new ServerSentEvent('ping', {hearbeat: Date.now(), id}))
    }, 700)
}
