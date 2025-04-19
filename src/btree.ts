import {
    BTreeInterface,
    BTreeSerializableInterface,
    BTreeNodeInterface,
    BTreeNodeSerializableInterface,
} from './interfaces.js';

export class BTreeNode<T>
    implements BTreeNodeInterface<T>, BTreeNodeSerializableInterface<T>
{
    public isLeaf: boolean;
    public keys: T[];
    public children: BTreeNode<T>[];
    constructor(isLeaf = false) {
        this.isLeaf = isLeaf;
        this.keys = [];
        this.children = [];
    }

    findIndex(key: T) {
        let i = 0;
        while (i < this.keys.length && key > this.keys[i]) {
            i++;
        }
        return i;
    }

    toJSON(): BTreeNodeSerializableInterface<T> {
        return {
            isLeaf: this.isLeaf,
            keys: this.keys,
            children: this.children.map((child) => child.toJSON()),
        };
    }

    static fromJSON<T>(json: BTreeNodeSerializableInterface<T>) {
        const node = new BTreeNode<T>(json.isLeaf);
        node.keys = json.keys;
        node.children = json.children.map(BTreeNode.fromJSON<T>);
        return node;
    }
}

export class BTree<T>
    implements BTreeInterface<T>, BTreeSerializableInterface<T>
{
    public t: number;
    public root: BTreeNode<T>;
    constructor(t = 2) {
        this.t = t;
        this.root = new BTreeNode<T>(true);
    }

    search(node: BTreeNode<T>, key: T): boolean {
        let i = node.findIndex(key);

        if (i < node.keys.length && node.keys[i] === key) {
            return true;
        }

        if (node.isLeaf) {
            return false;
        }

        return this.search(node.children[i], key);
    }

    contains(key: T) {
        return this.search(this.root, key);
    }

    insert(key: T) {
        const root = this.root;
        if (root.keys.length === 2 * this.t - 1) {
            const newRoot = new BTreeNode<T>(false);
            newRoot.children.push(root);
            this.splitChild(newRoot, 0);
            this.insertNonFull(newRoot, key);
            this.root = newRoot;
        } else {
            this.insertNonFull(root, key);
        }
    }

    private insertNonFull(node: BTreeNode<T>, key: T) {
        let i = node.keys.length - 1;

        if (node.isLeaf) {
            while (i >= 0 && key < node.keys[i]) {
                i--;
            }
            node.keys.splice(i + 1, 0, key);
        } else {
            while (i >= 0 && key < node.keys[i]) {
                i--;
            }
            i++;

            if (node.children[i].keys.length === 2 * this.t - 1) {
                this.splitChild(node, i);
                if (key > node.keys[i]) {
                    i++;
                }
            }
            this.insertNonFull(node.children[i], key);
        }
    }

    private splitChild(parent: BTreeNode<T>, i: number) {
        const fullChild = parent.children[i];
        const newChild = new BTreeNode<T>(fullChild.isLeaf);
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

    static fromJSON<T>(json: BTreeSerializableInterface<T>) {
        const tree = new BTree<T>(json.t);
        tree.root = BTreeNode.fromJSON<T>(json.root);
        return tree;
    }
}
