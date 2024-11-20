import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { splitString } from "./utils";

export class StringName extends AbstractName implements Name {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.name = other;
        // split string at all unescaped delimiters to count the
        // length of the name
        // Note: the escaping inside the regex does not handle
        // multiple character long strings as that behaviour isn't
        // specified.
        this.noComponents = splitString(this.name, this.delimiter).length;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    // return escaped
    public getComponent(i: number): string {
        if (i < 0 || i >= this.noComponents) throw new Error("Index out of bounds");

        return splitString(this.name, this.delimiter)[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.noComponents) throw new Error("Index out of bounds");
        
        const array = splitString(this.name, this.delimiter);
        array[i] = c;
        this.name = array.join(this.delimiter);
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.noComponents)
            throw new Error("Index out of bounds");

        const array = splitString(this.name, this.delimiter);
        array.splice(i, 0, c);
        this.name = array.join(this.delimiter);
        this.noComponents += 1;
    }

    public append(c: string): void {
        this.name += this.delimiter + c;
        this.noComponents += 1;
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.noComponents)
            throw new Error("Index out of bounds");
        
        const array = splitString(this.name, this.delimiter);
        array.splice(i, 1);
        this.name = array.join(this.delimiter);
        this.noComponents -= 1;
    }
}