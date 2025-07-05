export interface BTreeSerializableInterface<T> {
    t: number;
    root: BTreeNodeSerializableInterface<T>;
}
export interface BTreeNodeSerializableInterface<T> {
    isLeaf: boolean;
    keys: T[];
    children: BTreeNodeSerializableInterface<T>[];
}
export interface BTreeNodeInterface<T> {
    findIndex(key: T): number;
    toJSON(): BTreeNodeSerializableInterface<T>;
}

export interface BTreeInterface<T> {
    search(node: BTreeNodeInterface<T>, key: T): boolean;
    contains(key: T): boolean;
    insert(key: T): void;
    toJSON(): BTreeSerializableInterface<T>;
    searchAndFetch(node: BTreeNodeInterface<T>, key: T): T | undefined;
    fetch(key: T): T | undefined;
}

export interface BTreeKeyValueKeyInterface<K, V> {
    getKey(): K;
    getValue(): V;
}

export interface BTreeKeyValueSerializableInterface<K, V> {
    t: number;
    root: BTreeKeyValueNodeSerializableInterface<K, V>;
}
export interface BTreeKeyValueNodeSerializableInterface<K, V> {
    isLeaf: boolean;
    keys: BTreeKeyValueKeyInterface<K, V>[];
    children: BTreeKeyValueNodeSerializableInterface<K, V>[];
}
export interface BTreeKeyValueNodeInterface<K, V> {
    findIndex(key: BTreeKeyValueKeyInterface<K, V>): number;
    toJSON(): BTreeKeyValueNodeSerializableInterface<K, V>;
}

export interface BTreeKeyValueInterface<K, V> {
    search(
        node: BTreeKeyValueNodeInterface<K, V>,
        key: BTreeKeyValueKeyInterface<K, V>
    ): boolean;
    contains(key: BTreeKeyValueKeyInterface<K, V>): boolean;
    insert(key: BTreeKeyValueKeyInterface<K, V>): void;
    searchAndFetch(
        node: BTreeKeyValueNodeInterface<K, V>,
        key: BTreeKeyValueKeyInterface<K, V>
    ): BTreeKeyValueKeyInterface<K, V> | undefined;
    fetch(
        key: BTreeKeyValueKeyInterface<K, V>
    ): BTreeKeyValueKeyInterface<K, V> | undefined;
    toJSON(): BTreeKeyValueSerializableInterface<K, V>;
}
