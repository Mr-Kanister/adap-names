import { describe, it, expect } from "vitest";
import { checkEscaped } from "../../../src/adap-b04/names/utils";

describe("utils Tests", () => {
    it("test checkMasked", () => {
        expect(checkEscaped("\\c", ".")).toBe(false);
        expect(checkEscaped("\\\\", ".")).toBe(true);
        expect(checkEscaped("\\.", ".")).toBe(true);
        expect(checkEscaped("\\\\\\.", ".")).toBe(true);
    });
});