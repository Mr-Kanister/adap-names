import { InvalidStateException } from "../common/InvalidStateException";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { checkEscaped, splitString } from "./utils";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName implements Name {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        // precondition
        IllegalArgumentException.assertIsNotNullOrUndefined(other);

        super(delimiter);
        this.name = other;
        // split string at all unescaped delimiters to count the
        // length of the name
        // Note: the escaping inside the regex does not handle
        // multiple character long strings as that behaviour isn't
        // specified.
        this.noComponents = splitString(this.name, this.delimiter).length;

        // postcondition
        MethodFailedException.assertCondition(this.noComponents > 0, "noComponents should have positive value.");
        MethodFailedException.assertCondition(
            StringName.instanceIsStringName(this),
            "Instance doesn't fulfill prototype of StringName",
        );
    }
    
    protected static instanceIsStringName(instance: any): instance is StringName {
        return super.instanceIsAbstractName(instance) &&
            "name" in instance && typeof instance.name === "string" &&
            "noComponents" in instance && typeof instance.noComponents === "number";
    }

    protected static assertInstanceIsStringName(instance: any) {
        InvalidStateException.assertCondition(
            StringName.instanceIsStringName(instance),
            "Instance doesn't fulfill prototype of StringName."
        );
    }

    public override getNoComponents(): number {
        StringName.assertInstanceIsStringName(this);

        const res = this.noComponents;

        // postcondition
        MethodFailedException.assertCondition(res >= 0, "Must return non negative.");

        return res;
    }

    // return escaped
    public override getComponent(i: number): string {
        StringName.assertInstanceIsStringName(this);

        // precondition
        IllegalArgumentException.assertCondition(i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);

        const res = splitString(this.name, this.delimiter)[i];

        // postcondition
        MethodFailedException.assertIsNotNullOrUndefined(res);
        MethodFailedException.assertCondition(checkEscaped(res, this.getDelimiterCharacter()), `Component (${res}) must be escaped.`);

        return res;
    }

    public override setComponent(i: number, c: string): void {
        StringName.assertInstanceIsStringName(this);

        // precondition
        IllegalArgumentException.assertCondition(i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(checkEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);

        // postcondition
        this.tryBeforeAfterUnchanged(
            i,
            0,
            () => {
                const array = splitString(this.name, this.delimiter);
                array[i] = c;
                this.name = array.join(this.delimiter);
            },
            this.reset([this.getComponent(i)]),
        );
    }

    public override insert(i: number, c: string): void {
        StringName.assertInstanceIsStringName(this);

        // precondition
        IllegalArgumentException.assertCondition(i >= 0 && i <= this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(checkEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);

        // postcondition
        this.tryBeforeAfterUnchanged(
            i,
            1,
            () => {
                const array = splitString(this.name, this.delimiter);
                array.splice(i, 0, c);
                this.name = array.join(this.delimiter);
                this.noComponents += 1;
            },
            this.reset([]),
        );
    }

    public override append(c: string): void {
        StringName.assertInstanceIsStringName(this);

        // precondition
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(checkEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);

        // postcondition
        this.tryBeforeAfterUnchanged(
            this.getNoComponents(),
            1,
            () => {
                this.name += this.delimiter + c;
                this.noComponents += 1;
            },
            this.reset([]),
        );
    }

    public override remove(i: number): void {
        StringName.assertInstanceIsStringName(this);
        // precondition
        IllegalArgumentException.assertCondition(i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);

        // postcondition
        this.tryBeforeAfterUnchanged(
            i,
            -1,
            () => {
                const array = splitString(this.name, this.delimiter);
                array.splice(i, 1);
                this.name = array.join(this.delimiter);
                this.noComponents -= 1;
            },
            this.reset([this.getComponent(i)]),
        );
    }

    // all components are expected to be escaped
    private reset(componentsBetween: string[]) {
        return (componentsBefore: string[], componentsAfter: string[]) => {
            const allComponents = componentsBefore.concat(componentsBetween.concat(componentsAfter));
            this.name = allComponents.join(this.getDelimiterCharacter());
            this.noComponents = componentsBefore.length + componentsBetween.length + componentsAfter.length;
        }
    }
}