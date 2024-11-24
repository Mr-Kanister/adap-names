import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set();

    constructor(bn: string, pn: Directory) {
        // precondition
        IllegalArgumentException.assertIsNotNullOrUndefined(pn);
        IllegalArgumentException.assertCondition(typeof bn === "string", "basename must be at least one character long.");
        
        super(bn, pn);
    }

    public add(cn: Node): void {
        // precondition
        IllegalArgumentException.assertCondition(!this.childNodes.has(cn), "Node mustn't exist to add it.");

        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        // precondition
        IllegalArgumentException.assertCondition(this.childNodes.has(cn), "Node must exist to delete it.");

        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}