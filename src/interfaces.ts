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
