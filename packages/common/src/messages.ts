import { PlayerID, PlayerRole } from './players.ts'

export enum MessageType {
  TEXT = 'text',
  HEARTBEAT = 'heartbeat',
  STATUS = 'status',
  COMMAND = 'command',
}

export type Message = {
  type: MessageType
  body: string
  origin: PlayerID
  destination: PlayerRole
}
