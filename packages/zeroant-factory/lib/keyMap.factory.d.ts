export declare abstract class KeyMap extends Object {
    set<T extends keyof typeof this>(key: T, value: (typeof this)[T]): this;
    get<T extends keyof typeof this>(key: T): (typeof this)[T] | undefined;
    copy(map: Record<keyof any, any>): this;
    pick(...list: Array<keyof this>): Pick<this, keyof this>;
}
