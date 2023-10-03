import { BaseRegistry } from 'zeroant-common/base.registry';
import { type ConfigFactory } from 'zeroant-factory/config.factory';
import { type ZeroantContext } from 'zeroant-factory/zeroant.context';
import 'zeroant-loader/zeroant';
export declare class Registry extends BaseRegistry {
    onBootstrap(callback: (context: ZeroantContext<ConfigFactory>) => void): void;
    onReady(callback: (context: ZeroantContext<ConfigFactory>) => void): void;
}
