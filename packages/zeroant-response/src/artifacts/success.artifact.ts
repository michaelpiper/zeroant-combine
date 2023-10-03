import { type SuccessData } from 'zeroant-constant/response.type'
import { ArtifactFactory } from '../artifact.factory.js'

export class SuccessArtifact<T = SuccessData> extends ArtifactFactory<T> {
  protected readonly _statusCode = 200
  protected readonly _message = 'Success'
}
