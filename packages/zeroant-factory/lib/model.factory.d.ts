import { KeyMap } from './keyMap.factory.js';
import { type FactoryUpdateEntity, type FactoryEntity } from './entity.factory.js';
import { type Faker } from '@faker-js/faker';
export type ModelOmit<T, K extends keyof any> = Omit<T, K | 'set' | 'copy' | 'pick' | 'update'>;
export declare abstract class ModelFactory<ID = any> extends KeyMap {
    id: ID;
    get toJson(): Record<string, any>;
    update(data: FactoryUpdateEntity<this>): this;
    static fromEntity(entity: FactoryEntity<any>): ModelFactory;
}
export declare abstract class ModelListFactory<T = ModelFactory> {
    transactions: T[];
    seed(faker: Faker): T;
    seeds(length?: number): T[];
}
