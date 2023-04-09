export type GameID = string
export type PlayerID = { id: string; type: string }

export enum MessageType {
    TEXT = 'text',
    STATUS = 'satus',
}

export interface Message {
    type: MessageType
    body: string
    origin: string
}

export interface Result {
    success: boolean
    messages: string[]
}
