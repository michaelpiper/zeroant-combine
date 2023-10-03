import { ArtifactFactory } from '../artifact.factory.js'
export class CreateArtifact extends ArtifactFactory {
  protected readonly _statusCode = 201
  protected readonly _message = 'Created'
}
