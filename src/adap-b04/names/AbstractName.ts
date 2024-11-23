import { DEFAULT_DELIMITER } from "../common/Printable";
import { unescape, escape, checkEscaped } from "./utils";
import { Name } from "./Name";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // precondition
        IllegalArgumentException.assertCondition(
            typeof delimiter === "string" && delimiter.length === 1,
            "Delimiter has to be a one character string."
        );

        this.delimiter = delimiter ?? this.delimiter;

        // postcondition
        MethodFailureException.assertCondition(
            AbstractName.instanceIsAbstractName(this),
            "Instance doesn't fulfill prototype of AbstractName",
        );
    }

    protected static instanceIsName(instance: any): instance is Name {
        return "asString" in instance && typeof instance.asString === "function" &&
            "asDataString" in instance && typeof instance.asDataString === "function" &&
            "getDelimiterCharacter" in instance && typeof instance.getDelimiterCharacter === "function" &&
            "clone" in instance && typeof instance.clone === "function" &&
            "isEqual" in instance && typeof instance.isEqual === "function" &&
            "getHashCode" in instance && typeof instance.getHashCode === "function" &&
            "isEmpty" in instance && typeof instance.isEmpty === "function" &&
            "getNoComponents" in instance && typeof instance.getNoComponents === "function" &&
            "getComponent" in instance && typeof instance.getComponent === "function" &&
            "setComponent" in instance && typeof instance.setComponent === "function" &&
            "insert" in instance && typeof instance.insert === "function" &&
            "append" in instance && typeof instance.append === "function" &&
            "remove" in instance && typeof instance.remove === "function" &&
            "concat" in instance && typeof instance.concat === "function";
    }

    protected static instanceIsAbstractName(instance: any): instance is AbstractName {
        return AbstractName.instanceIsName(instance) && "delimiter" in instance &&
            typeof instance.delimiter === "string" && instance.delimiter.length === 1;
    }

    protected static assertInstanceIsAbstractName(instance: any) {
        InvalidStateException.assertCondition(
            AbstractName.instanceIsAbstractName(instance),
            "Instance doesn't fulfill AbstractName prototype."
        );
    }

    // returns unescaped string
    public asString(delimiter: string = this.delimiter): string {
        AbstractName.assertInstanceIsAbstractName(this);

        // precondition
        IllegalArgumentException.assertCondition(
            typeof delimiter === "string" && delimiter.length === 1,
            "Delimiter has to be a one character string."
        );

        const unescapedComponents = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            unescapedComponents.push(unescape(this.getComponent(i), this.delimiter));
        }

        const res = unescapedComponents.join(delimiter);

        // postcondition
        MethodFailureException.assertIsNotNullOrUndefined(res);
        // assertion of string being unescaped not possible due to edge cases

        return res;
    }

    public toString(): string {
        AbstractName.assertInstanceIsAbstractName(this);

        const res = this.asDataString();

        // postcondition
        MethodFailureException.assertIsNotNullOrUndefined(res);

        return res;
    }

    public asDataString(): string {
        AbstractName.assertInstanceIsAbstractName(this);

        const escapedComponents = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            escapedComponents.push(this.getComponent(i));
        }
        const res = escapedComponents.join(this.delimiter);

        // postcondition
        MethodFailureException.assertIsNotNullOrUndefined(res);

        return res;
    }

    public isEqual(other: Name): boolean {
        AbstractName.assertInstanceIsAbstractName(this);

        // precondition
        IllegalArgumentException.assertCondition(AbstractName.instanceIsName(other), "other has to be instance of Name.");

        return this.asDataString() === other.asDataString() &&
            this.getDelimiterCharacter() === other.getDelimiterCharacter();
    }

    public getHashCode(): number {
        AbstractName.assertInstanceIsAbstractName(this);

        let hashCode: number = 0;
        const s: string = this.toString() + this.getDelimiterCharacter();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    // shallow copy
    public clone(): Name {
        AbstractName.assertInstanceIsAbstractName(this);

        const res = Object.create(this);

        // postcondition
        MethodFailureException.assertCondition(
            AbstractName.instanceIsName(res),
            "Result has to be an instance of Name."
        );

        return res;
    }

    public isEmpty(): boolean {
        AbstractName.assertInstanceIsAbstractName(this);

        return this.getNoComponents() ? false : true;
    }

    public getDelimiterCharacter(): string {
        AbstractName.assertInstanceIsAbstractName(this);

        const res = this.delimiter;

        // postcondition
        MethodFailureException.assertCondition(res.length === 1, "Delimiter has to be a one character string.");

        return res;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        AbstractName.assertInstanceIsAbstractName(this);

        // precondition
        IllegalArgumentException.assertCondition(AbstractName.instanceIsName(other), "other has to be instance of Name.");

        const otherDelim = other.getDelimiterCharacter();
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(escape(unescape(other.getComponent(i), otherDelim), this.delimiter));
        }

        // postcondition not possible as restoring the state would have
        // to happen in a concrete class.
    }



    // postcondition
    // index: index at which a component gets changed
    // delta: -1 for remove, 0 for set, 1 for insert/append
    // apply: function to call before assertion
    // reset(componentsBefore, componentsAfter): function to call if assertion fails
    protected tryBeforeAfterUnchanged(
        index: number,
        delta: number,
        apply: Function,
        reset: (cB: string[], cA: string[]) => void,
    ) {
        const lengthBefore = this.getNoComponents();
        const componentsBefore = [];
        for (let i = 0; i < index; i++) {
            componentsBefore.push(this.getComponent(i));
        }
        const componentsAfter = [];
        let startingIndex = delta === 0 || delta === -1 ? index + 1 : index;
        for (let i = startingIndex; i < this.getNoComponents(); i++) {
            componentsAfter.push(this.getComponent(i));
        }

        try {
            apply();

            MethodFailureException.assertCondition(this.getNoComponents() === lengthBefore + delta, "Unexpected number of components");

            for (let i = 0; i < componentsBefore.length; i++) {
                MethodFailureException.assertCondition(componentsBefore[i] === this.getComponent(i), `Untouched component changed from ${componentsBefore[i]} to ${this.getComponent(i)}.`);
            }
            startingIndex = delta === -1 ? index : index + 1;
            for (let i = 0; i < componentsAfter.length; i++) {
                MethodFailureException.assertCondition(componentsAfter[i] === this.getComponent(startingIndex + i), `Untouched component changed from ${componentsAfter[i]} to ${this.getComponent(startingIndex+i)}.`);
            }
        } catch (e) {
            reset(componentsBefore, componentsAfter);
            throw e;
        }
    }
}