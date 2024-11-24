import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(bn: string, pn: Directory) {
        // precondition
        IllegalArgumentException.assertIsNotNullOrUndefined(pn);
        IllegalArgumentException.assertCondition(typeof bn === "string" && bn.length > 0, "basename must be at least one character long.");
        
        super(bn, pn);
    }

    public open(): void {
        // precondition
        IllegalArgumentException.assertCondition(this.doGetFileState() === FileState.CLOSED, "File must be closed to open it.");

        // do something
    }

    public close(): void {
        // precondition
        IllegalArgumentException.assertCondition(this.doGetFileState() === FileState.OPEN, "File must be open to close it.");

        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}