import { KeyMap } from './keyMap.factory.js';
import { faker } from '@faker-js/faker';
export class ModelFactory extends KeyMap {
    id;
    get toJson() {
        return this;
    }
    update(data) {
        return Object.entries(data).reduce((o, [key, value]) => o.set(key, value), this);
    }
    static fromEntity(entity) {
        throw new Error('Most replace super ModelFactory');
    }
}
export class ModelListFactory {
    transactions = [];
    seed(faker) {
        throw Error('Must implement');
    }
    seeds(length = 3) {
        this.transactions = [];
        for (let i = 0; i < length; i++) {
            const item = this.seed(faker);
            this.transactions.push(item);
        }
        return this.transactions;
    }
}
//# sourceMappingURL=model.factory.js.map