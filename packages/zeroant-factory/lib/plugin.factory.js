import { ErrorCode, ErrorDescription } from 'zeroant-constant/response.enum';
import { InternalServerError } from 'zeroant-response/serverErrors/internalServerError.serverError';
export class Plugin {
    context;
    _addons = new Set();
    constructor(context) {
        this.context = context;
    }
    values() {
        return this._addons.values();
    }
    get(Type) {
        for (const addon of this._addons.values()) {
            if (addon instanceof Type) {
                return addon;
            }
        }
        throw new InternalServerError(ErrorCode.UNIMPLEMENTED_EXCEPTION, ErrorDescription.UNIMPLEMENTED_EXCEPTION, `${Type.name} Plugin you trying to get is not registered check common/registry.ts from more information`);
    }
    add(Addon) {
        this._addons.add(new Addon(this.context));
        return this;
    }
    async initialize() {
        for (const addon of this._addons.values()) {
            try {
                await addon.initialize();
            }
            catch (error) {
                throw new InternalServerError(ErrorCode.UNEXPECTED_ERROR, ErrorDescription.UNEXPECTED_ERROR, `Error while initializing plugin ${addon.constructor.name}: ${error.message}`).withRootError(error);
            }
        }
    }
}
//# sourceMappingURL=plugin.factory.js.map