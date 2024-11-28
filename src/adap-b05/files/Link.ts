import { Node } from "./Node";
import { Directory } from "./Directory";
import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        this.assertClassInvariants();

        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        this.assertClassInvariants();

        this.targetNode = target;
    }

    public getBaseName(): string {
        this.assertClassInvariants();

        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, target !== null && target !== undefined, "Target must not be null or undefined");

        const result: Node = this.targetNode as Node;
        return result;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public override findNodes(bn: string): Set<Node> {
        const res = super.findNodes(bn);
        if (bn === this.doGetBaseName()) {
            res.add(this);
        }
        return res;
    }
}