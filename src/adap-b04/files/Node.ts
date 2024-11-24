import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        // precondition
        IllegalArgumentException.assertIsNotNullOrUndefined(pn);
        IllegalArgumentException.assertCondition(typeof bn === "string", "basename must be at least one character long.");

        this.doSetBaseName(bn);
        this.parentNode = pn;
    }

    public move(to: Directory): void {
        // precondition
        IllegalArgumentException.assertIsNotNullOrUndefined(to);

        this.parentNode.remove(this);
        to.add(this);
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        // precondition
        IllegalArgumentException.assertCondition(typeof bn === "string" && bn.length > 0, "basename must be at least one character long.");

        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        // precondition
        IllegalArgumentException.assertCondition(typeof bn === "string" && bn.length > 0, "basename must be at least one character long.");
        
        this.baseName = bn;
    }

    public getParentNode(): Node {
        return this.parentNode;
    }

}
