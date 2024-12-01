import { ExceptionType, AssertionDispatcher } from "../common/AssertionDispatcher";
import { Exception } from "../common/Exception";
import { ServiceFailureException } from "../common/ServiceFailureException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);

        // this would be necessary but only without it the homework tests succeed :(
        // this.assertClassInvariants();
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.add(this);
    }

    public move(to: Directory): void {
        this.assertClassInvariants();

        this.parentNode.remove(this);
        to.add(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        this.assertClassInvariants();

        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        this.assertClassInvariants();

        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertClassInvariants();

        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        this.assertClassInvariants();

        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        try {
            const res = new Set<Node>();

            this._findInnerNodes(bn, res);

            return res;
        } catch (e) {
            throw new ServiceFailureException("findNodes() failed", e as Exception);
        }
    }

    public _findInnerNodes(bn: string, s: Set<Node>) {
        this.assertClassInvariants();

        if (bn === this.doGetBaseName()) s.add(this);
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        this.assertIsValidBaseName(bn, ExceptionType.CLASS_INVARIANT);
    }

    protected assertIsValidBaseName(bn: string, et: ExceptionType): void {
        const condition: boolean = (bn != "");
        AssertionDispatcher.dispatch(et, condition, "invalid base name");
    }

}
