import { Role } from './players.ts'

export enum MessageType {
    INFO = 'INFO',
    STATUS = 'STATUS',
    ERROR = 'ERROR',
}

export enum LifeCycle {
    STARTED = 'game started',
    HEARTBEAT = 'heartbeat',
    ENDED = 'game ended',
    UNCHANGED = 'unchanged',
}

export class Message {
    readonly type: MessageType
    readonly body: string | LifeCycle | Record<string, unknown>
    readonly origin: Role
    readonly destination: Role

    constructor(
        type: MessageType,
        body: string | LifeCycle | Record<string, unknown>,
        origin: Role,
        destination: Role,
    ) {
        this.type = type
        this.body = body
        this.origin = origin
        this.destination = destination
    }
}

export const started = new Message(
    MessageType.STATUS,
    LifeCycle.STARTED,
    Role.TECHNICAL,
    Role.ANY,
)

export const heartbeat = new Message(
    MessageType.STATUS,
    LifeCycle.HEARTBEAT,
    Role.TECHNICAL,
    Role.ANY,
)

export const ended = new Message(
    MessageType.STATUS,
    LifeCycle.ENDED,
    Role.TECHNICAL,
    Role.ANY,
)

export const notEnded = new Message(
    MessageType.ERROR,
    LifeCycle.UNCHANGED,
    Role.TECHNICAL,
    Role.ANY,
)
