import {getAvailablePortSync} from 'https://deno.land/x/port@1.0.0/mod.ts'

export function findAvailablePort(startingPort: number, maxPort: number): number {
    const port = getAvailablePortSync({port: {start: startingPort, end: maxPort}})
    if (port) {return port} else {throw new Error('unable to find available port')}
}
