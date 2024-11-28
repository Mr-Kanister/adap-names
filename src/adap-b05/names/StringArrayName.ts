import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { checkEscaped, escape, unescape } from "./utils";
import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";

export class StringArrayName extends AbstractName implements Name {

    protected components: string[] = []; // components get stored unescaped

    constructor(other: string[], delimiter?: string) {
        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, other !== undefined && other !== null, "Should be defined");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,other.length !== 0, "At least one component is required.");

        super(delimiter);

        // precondition
        for (const c of other) {
            AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,checkEscaped(c, this.delimiter), "Components must be escaped.");
        }

        // components get stored unescaped
        other = other.map(c => unescape(c, this.delimiter));
        this.components = other;

        // postcondition
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
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
        AssertionDispatcher.dispatch(ExceptionType.CLASS_INVARIANT,
            StringArrayName.instanceIsStringArrayName(instance),
            "Instance doesn't fulfill prototype of StringArrayName."
        );
    }

    public override getNoComponents(): number {
        StringArrayName.assertInstanceIsStringArrayName(this);

        const res = this.components.length;

        // postcondition
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,res >= 0, "Must return non negative.");

        return res;
    }

    // returns escaped
    public override getComponent(i: number): string {
        StringArrayName.assertInstanceIsStringArrayName(this);

        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,i >= 0 && i < this.getNoComponents(), "Index out of bounds.");

        const component = escape(this.components[i], this.delimiter);

        // postcondition
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, component !== undefined && component !== null, "Should be defined");
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,checkEscaped(component, this.getDelimiterCharacter()), "Component must be escaped.");
        
        return component;
    }
    
    // expects escaped
    public override setComponent(i: number, c: string): void {
        StringArrayName.assertInstanceIsStringArrayName(this);
        
        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, c !== undefined && c !== null, "Should be defined");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,i >= 0 && i < this.getNoComponents(), "Index out of bounds.");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,checkEscaped(c, this.getDelimiterCharacter()), "Component must be escaped.");

        // postcondition
        this.tryBeforeAfterUnchanged(
            i,
            0,
            () => this.components[i] = unescape(c, this.delimiter),
            this.reset([this.getComponent(i)]),
        );
    }

    public override insert(i: number, c: string): void {
        StringArrayName.assertInstanceIsStringArrayName(this);

        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, c !== undefined && c !== null, "Should be defined");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,i >= 0 && i <= this.getNoComponents(), "Index out of bounds.");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,checkEscaped(c, this.getDelimiterCharacter()), "Component must be escaped.");

        // postcondition
        this.tryBeforeAfterUnchanged(
            i,
            1,
            () => this.components.splice(i, 0, unescape(c, this.delimiter)),
            this.reset([]),
        );
    }

    public override append(c: string): void {
        StringArrayName.assertInstanceIsStringArrayName(this);

        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, c !== undefined && c !== null, "Should be defined");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,checkEscaped(c, this.getDelimiterCharacter()), "Component must be escaped.");

        // postcondition
        this.tryBeforeAfterUnchanged(
            this.getNoComponents(),
            1,
            () => this.components.push(unescape(c, this.delimiter)),
            this.reset([]),
        );
    }

    public override remove(i: number): void {
        StringArrayName.assertInstanceIsStringArrayName(this);

        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,i >= 0 && i < this.getNoComponents(), "Index out of bounds.");

        // postcondition
        this.tryBeforeAfterUnchanged(
            i,
            -1,
            () => this.components.splice(i, 1),
            this.reset([this.getComponent(i)]),
        );
    }

    // all components are expected to be escaped but get stored unescaped
    private reset(componentsBetween: string[]) {
        return (componentsBefore: string[], componentsAfter: string[]) => {
            this.components.length = 0;
            this.components = componentsBefore.map(c => unescape(c, this.getDelimiterCharacter())).concat(
                componentsBetween.map(c => unescape(c, this.getDelimiterCharacter())).concat(
                    componentsAfter.map(c => unescape(c, this.getDelimiterCharacter()))
                ));
        }
    }
}