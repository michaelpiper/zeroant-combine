import { ArtifactFactory } from '../artifact.factory.js'

export class AcceptedArtifact extends ArtifactFactory {
  protected readonly _statusCode = 202
  protected readonly _message = 'Accepted'
}
