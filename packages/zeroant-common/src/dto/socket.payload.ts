import { ErrorCode, ErrorDescription } from '../constants.js'
import { BadRequest } from 'zeroant-response/clientErrors/badRequest.clientError'
export class PubSocketPayload<SocketTopic extends string, T extends Record<string, any>> {
  constructor(
    public topic: SocketTopic,
    public payload: T,
    public sub: string | null = null
  ) {}

  static fromBuffer(data: Buffer) {
    const payload = data.toString('utf8')
    try {
      const json = JSON.parse(payload)
      return new PubSocketPayload(json.topic, json.payload ?? {}, json.sub ?? null)
    } catch (error: any) {
      console.error('SocketPubPayload.fromBuffer', error?.message)
    }
    throw new BadRequest(
      ErrorCode.INVALID_ARGUMENT,
      ErrorDescription.INVALID_ARGUMENT,
      'Invalid PubSocketPayload used in the argument body'
    )
  }

  toBuffer() {
    return Buffer.from(JSON.stringify({ topic: this.topic, sub: this.sub ?? null, payload: this.payload }))
  }
}

export class SubSocketPayload<SocketTopic extends string, T extends Record<string, any>> {
  constructor(
    public topic: SocketTopic,
    public payload: T
  ) {}

  static fromBuffer(data: Buffer) {
    const payload = data.toString('utf8')
    try {
      const json = JSON.parse(payload)
      return new PubSocketPayload(json.topic, json.payload ?? {})
    } catch (error: any) {
      console.error('SocketPubPayload.fromBuffer', error?.message)
    }
    throw new BadRequest(
      ErrorCode.INVALID_ARGUMENT,
      ErrorDescription.INVALID_ARGUMENT,
      'Invalid SubSocketPayload used in the argument body'
    )
  }

  toBuffer() {
    return Buffer.from(JSON.stringify({ topic: this.topic, payload: this.payload }))
  }
}
