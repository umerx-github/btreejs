import {
    BTreeKeyValueInterface,
    BTreeKeyValueNodeInterface,
    BTreeKeyValueKeyInterface,
    BTreeKeyValueSerializableInterface,
    BTreeKeyValueNodeSerializableInterface,
} from './interfaces.js';

export class BTreeKeyValueNode<K, V>
    implements
        BTreeKeyValueNodeInterface<K, V>,
        BTreeKeyValueNodeSerializableInterface<K, V>
{
    public isLeaf: boolean;
    public keys: BTreeKeyValueKeyInterface<K, V>[];
    public children: BTreeKeyValueNode<K, V>[];
    constructor(isLeaf = false) {
        this.isLeaf = isLeaf;
        this.keys = [];
        this.children = [];
    }

    findIndex(key: BTreeKeyValueKeyInterface<K, V>) {
        let i = 0;
        while (i < this.keys.length && key.getKey() > this.keys[i].getKey()) {
            i++;
        }
        return i;
    }

    toJSON(): BTreeKeyValueNodeSerializableInterface<K, V> {
        return {
            isLeaf: this.isLeaf,
            keys: this.keys,
            children: this.children.map((child) => child.toJSON()),
        };
    }

    static fromJSON<K, V>(json: BTreeKeyValueNodeSerializableInterface<K, V>) {
        const node = new BTreeKeyValueNode<K, V>(json.isLeaf);
        node.keys = json.keys;
        node.children = json.children.map(BTreeKeyValueNode.fromJSON<K, V>);
        return node;
    }
}

export class BTreeKeyValue<K, V>
    implements
        BTreeKeyValueInterface<K, V>,
        BTreeKeyValueSerializableInterface<K, V>
{
    public t: number;
    public root: BTreeKeyValueNode<K, V>;
    constructor(t = 2) {
        this.t = t;
        this.root = new BTreeKeyValueNode<K, V>(true);
    }

    searchAndFetch(
        node: BTreeKeyValueNode<K, V>,
        key: BTreeKeyValueKeyInterface<K, V>
    ): BTreeKeyValueKeyInterface<K, V> | undefined {
        let i = node.findIndex(key);

        if (i < node.keys.length && node.keys[i].getKey() === key.getKey()) {
            return node.keys[i];
        }

        if (node.isLeaf) {
            return undefined;
        }

        return this.searchAndFetch(node.children[i], key);
    }

    fetch(
        key: BTreeKeyValueKeyInterface<K, V>
    ): BTreeKeyValueKeyInterface<K, V> | undefined {
        return this.searchAndFetch(this.root, key);
    }

    search(
        node: BTreeKeyValueNode<K, V>,
        key: BTreeKeyValueKeyInterface<K, V>
    ): boolean {
        let i = node.findIndex(key);

        if (i < node.keys.length && node.keys[i].getKey() === key.getKey()) {
            return true;
        }

        if (node.isLeaf) {
            return false;
        }

        return this.search(node.children[i], key);
    }

    contains(key: BTreeKeyValueKeyInterface<K, V>) {
        return this.search(this.root, key);
    }

    insert(key: BTreeKeyValueKeyInterface<K, V>) {
        const root = this.root;
        if (root.keys.length === 2 * this.t - 1) {
            const newRoot = new BTreeKeyValueNode<K, V>(false);
            newRoot.children.push(root);
            this.splitChild(newRoot, 0);
            this.insertNonFull(newRoot, key);
            this.root = newRoot;
        } else {
            this.insertNonFull(root, key);
        }
    }

    private insertNonFull(
        node: BTreeKeyValueNode<K, V>,
        key: BTreeKeyValueKeyInterface<K, V>
    ) {
        let i = node.keys.length - 1;

        if (node.isLeaf) {
            while (i >= 0 && key.getKey() < node.keys[i].getKey()) {
                i--;
            }
            node.keys.splice(i + 1, 0, key);
        } else {
            while (i >= 0 && key.getKey() < node.keys[i].getKey()) {
                i--;
            }
            i++;

            if (node.children[i].keys.length === 2 * this.t - 1) {
                this.splitChild(node, i);
                if (key.getKey() > node.keys[i].getKey()) {
                    i++;
                }
            }
            this.insertNonFull(node.children[i], key);
        }
    }

    private splitChild(parent: BTreeKeyValueNode<K, V>, i: number) {
        const fullChild = parent.children[i];
        const newChild = new BTreeKeyValueNode<K, V>(fullChild.isLeaf);
        const t = this.t;

        newChild.keys = fullChild.keys.splice(t);
        const midKey = fullChild.keys.pop();
        if (undefined === midKey) {
            return;
        }

        if (!fullChild.isLeaf) {
            newChild.children = fullChild.children.splice(t);
        }

        parent.children.splice(i + 1, 0, newChild);
        parent.keys.splice(i, 0, midKey);
    }

    toJSON() {
        return {
            t: this.t,
            root: this.root.toJSON(),
        };
    }

    static fromJSON<K, V>(json: BTreeKeyValueSerializableInterface<K, V>) {
        const tree = new BTreeKeyValue<K, V>(json.t);
        tree.root = BTreeKeyValueNode.fromJSON<K, V>(json.root);
        return tree;
    }
}
