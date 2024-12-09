import { DEFAULT_DELIMITER } from "../common/Printable";
import { unescape, escape, joinUnescapedComponents } from "./utils";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // precondition
        IllegalArgumentException.assert(typeof delimiter === "string" && delimiter.length === 1,
            "Delimiter has to be a one character string."
        );

        this.delimiter = delimiter ?? this.delimiter;

        // postcondition
        MethodFailedException.assert(
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
        InvalidStateException.assert(
            AbstractName.instanceIsAbstractName(instance),
            "Instance doesn't fulfill AbstractName prototype."
        );
    }

    // returns unescaped string
    public asString(delimiter: string = this.delimiter): string {
        AbstractName.assertInstanceIsAbstractName(this);
        const before = structuredClone(this);

        // precondition
        IllegalArgumentException.assert(
            typeof delimiter === "string" && delimiter.length === 1,
            "Delimiter has to be a one character string."
        );

        const unescapedComponents = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            unescapedComponents.push(unescape(this.getComponent(i), this.delimiter));
        }

        const res = unescapedComponents.join(delimiter);

        // postcondition
        MethodFailedException.assert(res !== undefined && res !== null, "Should be defined");
        // assertion of string being unescaped not possible due to edge cases

        this.assertObjectUnchanged(before);
        return res;
    }

    public toString(): string {
        AbstractName.assertInstanceIsAbstractName(this);
        const before = structuredClone(this);

        const escapedComponents = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            escapedComponents.push(this.getComponent(i));
        }
        const res = escapedComponents.join(this.delimiter);

        // postcondition
        MethodFailedException.assert(res !== undefined && res !== null, "Should be defined");

        this.assertObjectUnchanged(before);
        return res;
    }

    public asDataString(): string {
        AbstractName.assertInstanceIsAbstractName(this);
        const before = structuredClone(this);

        const unescapedComponents = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            unescapedComponents.push(unescape(this.getComponent(i), this.delimiter));
        }
        const res = joinUnescapedComponents(unescapedComponents, DEFAULT_DELIMITER);

        // postcondition
        MethodFailedException.assert(res !== undefined && res !== null, "Should be defined");

        this.assertObjectUnchanged(before);
        return res;
    }

    public isEqual(other: AbstractName): boolean {
        AbstractName.assertInstanceIsAbstractName(this);
        const before = structuredClone(this);

        // precondition
        IllegalArgumentException.assert(other !== null);
        IllegalArgumentException.assert(AbstractName.instanceIsName(other), "other has to be instance of Name.");

        const res = this.asDataString() === other.asDataString() &&
            this.getDelimiterCharacter() === other.getDelimiterCharacter();

        this.assertObjectUnchanged(before);

        return res;
    }

    public getHashCode(): number {
        AbstractName.assertInstanceIsAbstractName(this);
        const before = structuredClone(this);

        let hashCode: number = 0;
        const s: string = this.toString() + this.getDelimiterCharacter();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        this.assertObjectUnchanged(before);
        return hashCode;
    }

    // shallow copy
    public clone(): Name {
        AbstractName.assertInstanceIsAbstractName(this);
        const before = structuredClone(this);

        const res = Object.create(this);
        Object.assign(res, this);

        // postcondition
        MethodFailedException.assert(
            AbstractName.instanceIsName(res),
            "Result has to be an instance of Name."
        );

        this.assertObjectUnchanged(before);
        return res;
    }

    public isEmpty(): boolean {
        AbstractName.assertInstanceIsAbstractName(this);
        const before = structuredClone(this);

        this.assertObjectUnchanged(before);
        return this.getNoComponents() ? false : true;
    }

    public getDelimiterCharacter(): string {
        AbstractName.assertInstanceIsAbstractName(this);
        const before = structuredClone(this);

        const res = this.delimiter;

        // postcondition
        MethodFailedException.assert(res.length === 1, "Delimiter has to be a one character string.");

        this.assertObjectUnchanged(before);

        return res;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): Name;

    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    public concat(other: Name): Name {
        AbstractName.assertInstanceIsAbstractName(this);
        const before = structuredClone(this);

        // precondition
        IllegalArgumentException.assert(AbstractName.instanceIsName(other), "other has to be instance of Name.");

        const otherDelim = other.getDelimiterCharacter();
        let newObject = Object.setPrototypeOf(structuredClone(this), Object.getPrototypeOf(this)) as Name;

        for (let i = 0; i < other.getNoComponents(); i++) {
            newObject = newObject.append(escape(unescape(other.getComponent(i), otherDelim), this.delimiter));
        }

        // postcondition not possible as restoring the state would have
        // to happen in a concrete class.
        this.assertObjectUnchanged(before);
        return newObject;
    }

    protected assertRestOfComponentsUntouched(
        index: number,
        delta: number,
        newObject: Name
    ) {
        MethodFailedException.assert(newObject.getNoComponents() === this.getNoComponents() + delta, "Unexpected number of components");

        for (let i = 0; i < index; i++) {
            MethodFailedException.assert(this.getComponent(i) === newObject.getComponent(i), `Untouched component changed from ${this.getComponent(i)} to ${newObject.getComponent(i)}.`);
        }

        const startingIndex = delta === 1 ? index : index + 1;
        for (let i = startingIndex; i < this.getNoComponents(); i++) {
            MethodFailedException.assert(this.getComponent(i) === newObject.getComponent(i + delta), `Untouched component changed from ${this.getComponent(i)} to ${newObject.getComponent(i + delta)}.`);
        }
    }

    protected assertObjectUnchanged(before: any) {
        if (this.delimiter !== before.delimiter) {
            console.log(before);
        }
        InvalidStateException.assert(this.delimiter === before.delimiter);
    }
}