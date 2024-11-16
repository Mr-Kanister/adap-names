import { AbstractName } from "./AbstractName";
import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { escape, unescape } from "./utils";

export class StringArrayName extends AbstractName implements Name {

    protected components: string[] = []; // components get stored unescaped

    constructor(other: string[], delimiter?: string) {
        if (other.length === 0) throw new Error("At least one component required.");
        super(delimiter);
        // components get stored unescaped
        other = other.map(c => unescape(c, this.delimiter));
        this.components = other;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    // returns escaped
    public getComponent(i: number): string {
        if (i < 0 || i >= this.getNoComponents()) throw new Error("Index out of bounds");
        return escape(this.components[i], this.delimiter);
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.getNoComponents()) throw new Error("Index out of bounds");
        // components get stored unescaped
        this.components[i] = unescape(c, this.delimiter);
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.getNoComponents()) throw new Error("Index out of bounds");
        // components get stored unescaped
        this.components.splice(i, 0, unescape(c, this.delimiter));
    }

    public append(c: string): void {
        // components get stored unescaped
        this.components.push(unescape(c, this.delimiter));
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) throw new Error("Index out of bounds");
        this.components.splice(i, 1);
    }
}