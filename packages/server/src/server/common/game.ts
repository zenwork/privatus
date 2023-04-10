export type GameID = string
export class GameKey {
    readonly prefix: string
    readonly id: string

    constructor() {
        this.prefix = 'GM'
        this.id = this.generateId()
    }

    toString() {
        return `${this.prefix}-${this.id}`
    }

    private generateId(length = 5): string {
        let result = ''
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const charactersLength = characters.length
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    }
}
