import { BaseRegistry } from 'zeroant-common/base.registry';
import { ZeroantEvent } from 'zeroant-constant/zeroant.enum';
import zeroant from 'zeroant-loader/zeroant';
export class Registry extends BaseRegistry {
    onBootstrap(callback) {
        zeroant.on(ZeroantEvent.BOOTSTRAP, callback);
    }
    onReady(callback) {
        zeroant.on(ZeroantEvent.READY, callback);
    }
}
//# sourceMappingURL=registry.js.map