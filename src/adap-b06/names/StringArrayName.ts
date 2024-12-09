import { unsubscribe } from "diagnostics_channel";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { StringName } from "./StringName";
import { checkEscaped, escape, unescape } from "./utils";

export class StringArrayName extends AbstractName implements Name {

    protected components: string[] = []; // components get stored unescaped

    constructor(other: string[], delimiter?: string) {
        // precondition
        IllegalArgumentException.assert(other !== undefined && other !== null, "Should be defined");

        super(delimiter);

        // precondition
        for (const c of other) {
            IllegalArgumentException.assert(checkEscaped(c, this.delimiter), "Components must be escaped.");
        }

        // components get stored unescaped
        other = other.map(c => unescape(c, this.delimiter));
        this.components = other;

        // postcondition
        MethodFailedException.assert(
            StringArrayName.instanceIsStringArrayName(this),
            "Instance doesn't fulfill prototype of StringArrayName",
        );
    }

    protected static instanceIsStringArrayName(instance: any): instance is StringArrayName {
        return super.instanceIsAbstractName(instance) &&
            "components" in instance && instance.components instanceof Array &&
            instance.components.reduce((p, c) => p && typeof c === "string", true);
    }

    protected static assertInstanceIsStringArrayName(instance: any) {
        InvalidStateException.assert(
            StringArrayName.instanceIsStringArrayName(instance),
            "Instance doesn't fulfill prototype of StringArrayName."
        );
    }

    public override getNoComponents(): number {
        StringArrayName.assertInstanceIsStringArrayName(this);
        const before = structuredClone(this);

        const res = this.components.length;

        // postcondition
        MethodFailedException.assert(res >= 0, "Must return non negative.");

        this.assertObjectUnchanged(before);
        return res;
    }

    // returns escaped
    public override getComponent(i: number): string {
        StringArrayName.assertInstanceIsStringArrayName(this);
        const before = structuredClone(this);

        // precondition
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds.");

        const component = escape(this.components[i], this.delimiter);

        // postcondition
        MethodFailedException.assert(component !== undefined && component !== null, "Should be defined");
        MethodFailedException.assert(checkEscaped(component, this.getDelimiterCharacter()), "Component must be escaped.");

        this.assertObjectUnchanged(before);

        return component;
    }

    // expects escaped
    public override setComponent(i: number, c: string): StringArrayName {
        StringArrayName.assertInstanceIsStringArrayName(this);
        const before = structuredClone(this);

        // precondition
        IllegalArgumentException.assert(c !== undefined && c !== null, "Should be defined");
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds.");
        IllegalArgumentException.assert(checkEscaped(c, this.getDelimiterCharacter()), "Component must be escaped.");


        const componentsClone = [...this.components].map(c => escape(c, this.delimiter));
        componentsClone[i] = unescape(c, this.delimiter);
        const newObject = new StringArrayName(componentsClone, this.delimiter);

        // postcondition
        this.assertRestOfComponentsUntouched(i, 0, newObject);

        // class invariant
        this.assertObjectUnchanged(before);
        return newObject;
    }

    public override insert(i: number, c: string): StringArrayName {
        StringArrayName.assertInstanceIsStringArrayName(this);
        const before = structuredClone(this);

        // precondition
        IllegalArgumentException.assert(c !== undefined && c !== null, "Should be defined");
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(), "Index out of bounds.");
        IllegalArgumentException.assert(checkEscaped(c, this.getDelimiterCharacter()), "Component must be escaped.");

        const componentsClone = [...this.components].map(c => escape(c, this.delimiter));
        componentsClone.splice(i, 0, unescape(c, this.delimiter));
        const newObject = new StringArrayName(componentsClone, this.delimiter);

        // postcondition
        this.assertRestOfComponentsUntouched(i, 1, newObject);

        // class invariant
        this.assertObjectUnchanged(before);
        return newObject;
    }

    public override append(c: string): StringArrayName {
        StringArrayName.assertInstanceIsStringArrayName(this);
        const before = structuredClone(this);

        // precondition
        IllegalArgumentException.assert(c !== undefined && c !== null, "Should be defined");
        IllegalArgumentException.assert(checkEscaped(c, this.getDelimiterCharacter()), "Component must be escaped.");

        const componentsClone = [...this.components].map(c => escape(c, this.delimiter));
        componentsClone.push(c);
        const newObject = new StringArrayName(componentsClone, this.delimiter);

        // postcondition
        this.assertRestOfComponentsUntouched(this.getNoComponents(), 1, newObject);

        // class invariant
        this.assertObjectUnchanged(before);
        return newObject;
    }

    public override remove(i: number): StringArrayName {
        StringArrayName.assertInstanceIsStringArrayName(this);
        const before = structuredClone(this);

        // precondition
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds.");

        const componentsClone = [...this.components].map(c => escape(c, this.delimiter));
        componentsClone.splice(i, 1);
        const newObject = new StringArrayName(componentsClone, this.delimiter);

        // postcondition
        this.assertRestOfComponentsUntouched(i, -1, newObject);

        // class invariant
        this.assertObjectUnchanged(before);
        return newObject;
    }

    protected override assertObjectUnchanged(before: any): void {
        super.assertObjectUnchanged(before);

        InvalidStateException.assert(JSON.stringify(before.components) === JSON.stringify(this.components));
    }
}