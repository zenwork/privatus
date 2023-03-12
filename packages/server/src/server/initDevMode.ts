import {esBuildWatch} from '../build/dev.ts'

export function initDevMode() {
    console.log('start in dev mode')
    esBuildWatch()
}
