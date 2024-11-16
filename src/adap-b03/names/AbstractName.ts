import { Name, DEFAULT_DELIMITER } from "./Name";
import { unescape, escape } from "./utils";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter ?? this.delimiter;
    }

    // returns unescaped string
    public asString(delimiter: string = this.delimiter): string {
        const unescapedComponents = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            unescapedComponents.push(unescape(this.getComponent(i), this.delimiter));
        }
        return unescapedComponents.join(delimiter);
    }

    // returns escaped string
    public toString(): string {
        return this.asDataString();
    }

    // returns escaped string
    public asDataString(): string {
        // old spec version: only default delimiter
        // const unescapedComponents = [];
        // for (let i = 0; i < this.getNoComponents(); i++) {
        //     unescapedComponents.push(unescape(this.getComponent(i), this.delimiter));
        // }
        // return joinUnescapedComponents(unescapedComponents, DEFAULT_DELIMITER);

        const escapedComponents = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            escapedComponents.push(this.getComponent(i));
        }
        return escapedComponents.join(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        return this.asDataString() === other.asDataString() &&
            this.getDelimiterCharacter() === other.getDelimiterCharacter();
    }

    public getHashCode(): number {
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
        return Object.create(this);
    }

    public isEmpty(): boolean {
        return this.getNoComponents() ? false : true;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        const otherDelim = other.getDelimiterCharacter();
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(escape(unescape(other.getComponent(i), otherDelim), this.delimiter));
        }
    }
}