import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { checkEscaped, escape, unescape } from "./utils";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName implements Name {

    protected components: string[] = []; // components get stored unescaped

    constructor(other: string[], delimiter?: string) {
        // precondition
        IllegalArgumentException.assertIsNotNullOrUndefined(other);
        IllegalArgumentException.assertCondition(other.length !== 0, "At least one component is required.");

        super(delimiter);

        // precondition
        for (const c of other) {
            IllegalArgumentException.assertCondition(checkEscaped(c, this.delimiter), "Components must be escaped.");
        }

        // components get stored unescaped
        other = other.map(c => unescape(c, this.delimiter));
        this.components = other;

        // postcondition
        MethodFailedException.assertCondition(
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
        InvalidStateException.assertCondition(
            StringArrayName.instanceIsStringArrayName(instance),
            "Instance doesn't fulfill prototype of StringArrayName."
        );
    }

    public override getNoComponents(): number {
        StringArrayName.assertInstanceIsStringArrayName(this);

        const res = this.components.length;

        // postcondition
        MethodFailedException.assertCondition(res >= 0, "Must return non negative.");

        return res;
    }

    // returns escaped
    public override getComponent(i: number): string {
        StringArrayName.assertInstanceIsStringArrayName(this);

        // precondition
        IllegalArgumentException.assertCondition(i >= 0 && i < this.getNoComponents(), "Index out of bounds.");

        const component = escape(this.components[i], this.delimiter);

        // postcondition
        MethodFailedException.assertIsNotNullOrUndefined(component);
        MethodFailedException.assertCondition(checkEscaped(component, this.getDelimiterCharacter()), "Component must be escaped.");

        return component;
    }

    // expects escaped
    public override setComponent(i: number, c: string): void {
        StringArrayName.assertInstanceIsStringArrayName(this);

        // precondition
        IllegalArgumentException.assertCondition(i >= 0 && i < this.getNoComponents(), "Index out of bounds.");
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(checkEscaped(c, this.getDelimiterCharacter()), "Component must be escaped.");

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
        IllegalArgumentException.assertCondition(i >= 0 && i <= this.getNoComponents(), "Index out of bounds.");
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(checkEscaped(c, this.getDelimiterCharacter()), "Component must be escaped.");

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
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(checkEscaped(c, this.getDelimiterCharacter()), "Component must be escaped.");

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
        IllegalArgumentException.assertCondition(i >= 0 && i < this.getNoComponents(), "Index out of bounds.");

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