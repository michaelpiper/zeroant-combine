import { BaseRegistry } from 'zeroant-common/base.registry';
import 'zeroant-loader/zeroant';
export class Registry extends BaseRegistry {
    onBootstrap(callback) {
        this.bootstrap = callback;
    }
    onReady(callback) {
        this.ready = callback;
    }
}
//# sourceMappingURL=registry.js.map