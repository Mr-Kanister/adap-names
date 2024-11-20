import { ESCAPE_CHARACTER } from "../common/Printable";

export function escape(str: string, delim: string) {
    const regex = new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delim}`, "g");
    return str.replaceAll(regex, ESCAPE_CHARACTER + delim);
}

export function unescape(str: string, delim: string) {
    const regex = new RegExp(`\\${ESCAPE_CHARACTER}\\${delim}`, "g");
    return str.replaceAll(regex, delim);
}

export function splitString(str: string, delim: string) {
    const regex = new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delim}`);
    return str.split(regex);
}

export function joinUnescapedComponents(components: string[], delim: string) {
    return components.map(c => escape(c, delim)).join(delim);
}