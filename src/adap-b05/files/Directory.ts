import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";
import { Exception } from "../common/Exception";
import { ServiceFailureException } from "../common/ServiceFailureException";
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
        const s = super.findNodes(bn);
        try {
            this._findInnerNodes(bn, s);
            return s;
        } catch (e) {
            throw new ServiceFailureException("findNodes() failed", e as Exception);
        }
    }

    public override _findInnerNodes(bn: string, s: Set<Node>): void {
        this.assertClassInvariants();

        this.childNodes.forEach(node => node._findInnerNodes(bn, s));
    }
}