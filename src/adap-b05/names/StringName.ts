import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { checkEscaped, splitString } from "./utils";

export class StringName extends AbstractName implements Name {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, other !== undefined && other !== null, "Should be defined");
        
        super(delimiter);
        this.name = other;
        // split string at all unescaped delimiters to count the
        // length of the name
        // Note: the escaping inside the regex does not handle
        // multiple character long strings as that behaviour isn't
        // specified.
        this.noComponents = splitString(this.name, this.delimiter).length;

        // postcondition
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,this.noComponents > 0, "noComponents should have positive value.");
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
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
        AssertionDispatcher.dispatch(ExceptionType.CLASS_INVARIANT,
            StringName.instanceIsStringName(instance),
            "Instance doesn't fulfill prototype of StringName."
        );
    }

    public override getNoComponents(): number {
        StringName.assertInstanceIsStringName(this);

        const res = this.noComponents;

        // postcondition
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,res >= 0, "Must return non negative.");

        return res;
    }

    // return escaped
    public override getComponent(i: number): string {
        StringName.assertInstanceIsStringName(this);

        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);

        const res = splitString(this.name, this.delimiter)[i];

        // postcondition
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, res !== undefined && res !== null, "Should be defined");
        
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,checkEscaped(res, this.getDelimiterCharacter()), `Component (${res}) must be escaped.`);

        return res;
    }

    public override setComponent(i: number, c: string): void {
        StringName.assertInstanceIsStringName(this);

        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, c !== undefined && c !== null, "Should be defined");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,checkEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);

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
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,i >= 0 && i <= this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, c !== undefined && c !== null, "Should be defined");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,checkEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);

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
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, c !== undefined && c !== null, "Should be defined");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,checkEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);

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
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);

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