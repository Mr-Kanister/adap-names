import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";

enum ExceptionType {
    PRECONDITION,
    POSTCONDITION,
    CLASS_INVARIANT,
}

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        
        return new StringName("", '/');
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert( false, "Root can't be moved");
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        // null operation
    }

    protected assertIsValidBaseName(bn: string, et: ExceptionType): void {
        const condition: boolean = (bn === ""); // Root must have "" as base name
        switch (et) {
            case ExceptionType.PRECONDITION:
                IllegalArgumentException.assert(condition, "invalid base name");
                break;
            case ExceptionType.POSTCONDITION:
                MethodFailedException.assert(condition, "invalid base name");
                break;
            case ExceptionType.CLASS_INVARIANT:
                InvalidStateException.assert(condition, "invalid base name");
                break;
        }
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        this.assertIsValidBaseName(bn, ExceptionType.CLASS_INVARIANT);
    }

}