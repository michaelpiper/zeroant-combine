import { ArtifactFactory } from '../artifact.factory.js';
export declare class CreateArtifact extends ArtifactFactory {
    protected readonly _statusCode = 201;
    protected readonly _message = "Created";
}
