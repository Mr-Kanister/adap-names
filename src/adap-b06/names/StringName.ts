import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { checkEscaped, splitString } from "./utils";

export class StringName extends AbstractName implements Name {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        // precondition
        IllegalArgumentException.assert(other !== undefined && other !== null, "Should be defined");

        super(delimiter);
        this.name = other;
        // split string at all unescaped delimiters to count the
        // length of the name
        // Note: the escaping inside the regex does not handle
        // multiple character long strings as that behaviour isn't
        // specified.
        this.noComponents = splitString(this.name, this.delimiter).length;

        // postcondition
        MethodFailedException.assert(this.noComponents > 0, "noComponents should have positive value.");
        MethodFailedException.assert(StringName.instanceIsStringName(this),
            "Instance doesn't fulfill prototype of StringName",
        );
    }

    public setNoComponentes(noComponents: number) {
        this.noComponents = noComponents;
    }

    protected static instanceIsStringName(instance: any): instance is StringName {
        return super.instanceIsAbstractName(instance) &&
            "name" in instance && typeof instance.name === "string" &&
            "noComponents" in instance && typeof instance.noComponents === "number";
    }

    protected static assertInstanceIsStringName(instance: any) {
        InvalidStateException.assert(
            StringName.instanceIsStringName(instance),
            "Instance doesn't fulfill prototype of StringName."
        );
    }

    public override getNoComponents(): number {
        StringName.assertInstanceIsStringName(this);
        const before = structuredClone(this);

        const res = this.noComponents;

        // postcondition
        MethodFailedException.assert(res >= 0, "Must return non negative.");

        this.assertObjectUnchanged(before);
        return res;
    }

    // return escaped
    public override getComponent(i: number): string {
        StringName.assertInstanceIsStringName(this);
        const before = structuredClone(this);

        // precondition
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);

        const res = splitString(this.name, this.delimiter)[i];

        // postcondition
        MethodFailedException.assert(res !== undefined && res !== null, "Should be defined");

        MethodFailedException.assert(checkEscaped(res, this.getDelimiterCharacter()), `Component (${res}) must be escaped.`);

        this.assertObjectUnchanged(before);
        return res;
    }

    public override setComponent(i: number, c: string): StringName {
        StringName.assertInstanceIsStringName(this);
        const before = structuredClone(this);

        // precondition
        IllegalArgumentException.assert(c !== undefined && c !== null, "Should be defined");
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);
        IllegalArgumentException.assert(checkEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);


        const array = splitString(this.name, this.delimiter);
        array[i] = c;
        const newString = array.join(this.delimiter);

        const newObject = new StringName(newString, this.delimiter);

        // postcondition
        this.assertRestOfComponentsUntouched(i, 0, newObject);

        // class invariant
        this.assertObjectUnchanged(before);
        return newObject;
    }

    public override insert(i: number, c: string): StringName {
        StringName.assertInstanceIsStringName(this);
        const before = structuredClone(this);

        // precondition
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);
        IllegalArgumentException.assert(c !== undefined && c !== null, "Should be defined");
        IllegalArgumentException.assert(checkEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);

        const array = splitString(this.name, this.delimiter);
        array.splice(i, 0, c);
        const newString = array.join(this.delimiter);

        const newObject = new StringName(newString, this.delimiter);

        // postcondition
        this.assertRestOfComponentsUntouched(i, 1, newObject);

        // class invariant
        this.assertObjectUnchanged(before);
        return newObject;
    }

    public override append(c: string): StringName {
        StringName.assertInstanceIsStringName(this);
        const before = structuredClone(this);

        // precondition
        IllegalArgumentException.assert(c !== undefined && c !== null, "Should be defined");
        IllegalArgumentException.assert(checkEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);

        const newString = this.name + this.delimiter + c;

        const newObject = new StringName(newString, this.delimiter);

        // postcondition
        this.assertRestOfComponentsUntouched(this.getNoComponents(), 1, newObject);

        // class invariant
        this.assertObjectUnchanged(before);
        return newObject;
    }

    public override remove(i: number): StringName {
        StringName.assertInstanceIsStringName(this);
        const before = structuredClone(this);
        // precondition
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);

        const array = splitString(this.name, this.delimiter);
        array.splice(i, 1);
        const newString = array.join(this.delimiter);

        const newObject = new StringName(newString, this.delimiter);

        if (this.noComponents == 1) {
            newObject.setNoComponentes(0);
        }

        // postcondition
        this.assertRestOfComponentsUntouched(i, -1, newObject);

        // class invariant
        this.assertObjectUnchanged(before);
        return newObject;
    }

    protected override assertObjectUnchanged(before: any): void {
        super.assertObjectUnchanged(before);

        InvalidStateException.assert(this.name === before.name && this.noComponents === before.noComponents);
    }
}