import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected components: string[] = []; // components get stored unescaped
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(other: string[], delimiter?: string) {
        if (other.length === 0) throw new Error("At least one component required.");
        this.delimiter = delimiter ?? this.delimiter;
        // components get stored unescaped
        const regex = new RegExp(`\\\\\\${this.delimiter}`, "g");
        other = other.map(c => c.replaceAll(regex, this.delimiter));
        this.components = other;
    }

    public asString(delimiter: string = this.delimiter): string {
        // components are unescaped -> just join them together
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        // escape any characters that match the default delimiter
        // and join afterwards with default delimiter
        const regex = new RegExp(`(?<!\\\\)\\${DEFAULT_DELIMITER}`, "g");
        return this.components.map(c => c.replaceAll(
            regex, ESCAPE_CHARACTER + DEFAULT_DELIMITER))
            .join(DEFAULT_DELIMITER);
    }

    public isEmpty(): boolean {
        return this.components.length ? false : true;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.getNoComponents()) throw new Error("Index out of bounds");
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.getNoComponents()) throw new Error("Index out of bounds");
        // components get stored unescaped
        c = c.replaceAll(ESCAPE_CHARACTER, "");
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.getNoComponents()) throw new Error("Index out of bounds");
        // components get stored unescaped
        c = c.replaceAll(ESCAPE_CHARACTER, "");
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        // components get stored unescaped
        c = c.replaceAll(ESCAPE_CHARACTER, "");
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) throw new Error("Index out of bounds");
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        if (other.getDelimiterCharacter() !== this.getDelimiterCharacter())
            throw new Error("The name has the wrong delimiter.");
        // split string at all unescaped delimiters.
        // Note: the escaping inside the regex does not handle
        // multiple character long strings as that behaviour isn't
        // specified.
        const regex = new RegExp(`(?<!\\\\)\\${this.getDelimiterCharacter()}`);
        const array = other.asDataString().split(regex);
        array.forEach(entry => {
            this.append(entry)
        });
    }
}