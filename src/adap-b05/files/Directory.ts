import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, !this.childNodes.has(cn), "Node mustn't exist to add it.");

        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.childNodes.has(cn), "Node must exist to delete it.");

        this.childNodes.delete(cn); // Yikes! Should have been called remove
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