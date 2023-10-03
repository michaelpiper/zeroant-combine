import _ from 'lodash';
export class KeyMap extends Object {
    set(key, value) {
        this[key] = value;
        return this;
    }
    get(key) {
        return this[key];
    }
    copy(map) {
        for (const key in map) {
            if (!Object.hasOwn(this, key) && typeof this[key] !== 'function') {
                ;
                this[key] = map[key] ?? this[key];
            }
        }
        return this;
    }
    pick(...list) {
        return _.pick(this, list);
    }
}
//# sourceMappingURL=keyMap.factory.js.map