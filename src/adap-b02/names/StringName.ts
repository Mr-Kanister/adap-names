import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        this.name = other;
        // split string at all unescaped delimiters to count the
        // length of the name
        // Note: the escaping inside the regex does not handle
        // multiple character long strings as that behaviour isn't
        // specified.
        this.delimiter = delimiter ?? this.delimiter;
        const regex = new RegExp(`(?<!\\\\)\\${this.getDelimiterCharacter()}`);
        this.noComponents = other.split(regex).length;
    }

    public asString(delimiter: string = this.delimiter): string {
        let name = this.name; 
        if (delimiter !== this.delimiter) {
            const regex = new RegExp(`(?<!\\\\)\\${this.getDelimiterCharacter()}`, "g");
            name = name.replaceAll(regex, delimiter);
        }
        return name.replaceAll(ESCAPE_CHARACTER, "");
    }

    public asDataString(): string {
        let name = this.name;
        if (this.getDelimiterCharacter() !== DEFAULT_DELIMITER) {
            // escape all unescaped default delimiters
            let regex = new RegExp(`(?<!\\\\)\\${DEFAULT_DELIMITER}`, "g");
            name = name.replaceAll(regex, ESCAPE_CHARACTER + DEFAULT_DELIMITER);
            
            // switch from this.delimiter to default delimiter
            regex = new RegExp(`(?<!\\\\)\\${this.getDelimiterCharacter()}`, "g");
            name = name.replaceAll(regex, DEFAULT_DELIMITER);
            
            // unescape all escaped this.delimiter's
            name = name.replaceAll(ESCAPE_CHARACTER + this.getDelimiterCharacter(), this.getDelimiterCharacter());
        }
        return name;
    }

    public isEmpty(): boolean {
        return this.noComponents ? false : true;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.getNoComponents()) throw new Error("Index out of bounds");

        const regex = new RegExp(`(?<!\\\\)\\${this.getDelimiterCharacter()}`);
        return this.name.split(regex)[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.getNoComponents()) throw new Error("Index out of bounds");
        
        const regex = new RegExp(`(?<!\\\\)\\${this.getDelimiterCharacter()}`);
        const array = this.name.split(regex);
        array[i] = c;
        this.name = array.join(this.delimiter);
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.getNoComponents())
            throw new Error("Index out of bounds");

        const regex = new RegExp(`(?<!\\\\)\\${this.getDelimiterCharacter()}`);
        let array = this.name.split(regex);
        array.splice(i, 0, c);
        this.name = array.join(this.delimiter);
        this.noComponents += 1;
    }

    public append(c: string): void {
        this.name += this.delimiter + c;
        this.noComponents += 1;
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.getNoComponents())
            throw new Error("Index out of bounds");
        
        const regex = new RegExp(`(?<!\\\\)\\${this.getDelimiterCharacter()}`);
        let array = this.name.split(regex);
        array.splice(i, 1);
        this.name = array.join(this.delimiter);
        this.noComponents -= 1;
    }

    public concat(other: Name): void {
        if (other.getDelimiterCharacter() !== this.getDelimiterCharacter())
            throw new Error("The name has the wrong delimiter.");

        this.noComponents += other.getNoComponents();
        this.name += this.delimiter + other.asDataString();
    }
}