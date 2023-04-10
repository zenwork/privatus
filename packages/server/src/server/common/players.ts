export enum Role {
    ANY,
    CITIZEN,
    PROVIDER,
    ISSUER,
    PROFESSIONAL,
    TECHNICAL,
    LEDGER,
    UNKNOWN,
}

export function parseRole(val: string): Role {
    if (!val) {
        return Role.UNKNOWN
    }

    return Role[val as keyof typeof Role]
}

export class PlayerID {
    readonly key: string
    readonly role: Role

    constructor(key: string, role: Role) {
        this.key = key
        this.role = role
    }
}

export const server = new PlayerID('server', Role.TECHNICAL)
export const ledger = new PlayerID('ledger', Role.LEDGER)
