import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { AbstractName } from "../../../src/adap-b04/names/AbstractName";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";

describe("StringArrayName Tests", () => {
  it("test invalid construction", () => {
    // https://www.studon.fau.de/frm4447999_385940.html
    // "Ich denke, eine leeres string array zu uebergeben
    // sollte nicht erlaubt sein (im Constructor)."
    expect(() => new StringArrayName([])).toThrowError(IllegalArgumentException);

    expect(() => new StringArrayName(null as any)).toThrowError(IllegalArgumentException);
    expect(() => new StringArrayName(undefined as any)).toThrowError(IllegalArgumentException);
    expect(() => new StringArrayName(["hallo"], "delimiter")).toThrowError(IllegalArgumentException);
    expect(() => new StringArrayName(["hallo"], null as any)).toThrowError(IllegalArgumentException);
  });

  it("test class invariant", () => {
    let n = new StringArrayName(["oss", "cs"]);
    n["delimiter"] = "delimiter";
    expect(() => n.clone()).toThrowError(InvalidStateException);
    expect(() => n.asString()).toThrowError(InvalidStateException);
    expect(() => n.asDataString()).toThrowError(InvalidStateException);
    expect(() => n.getDelimiterCharacter()).toThrowError(InvalidStateException);
    expect(() => n.isEqual(new StringArrayName([""]))).toThrowError(InvalidStateException);
    expect(() => n.getHashCode()).toThrowError(InvalidStateException);
    expect(() => n.isEmpty()).toThrowError(InvalidStateException);
    expect(() => n.getNoComponents()).toThrowError(InvalidStateException);
    expect(() => n.getComponent(0)).toThrowError(InvalidStateException);
    expect(() => n.setComponent(0, "s")).toThrowError(InvalidStateException);
    expect(() => n.insert(0, "s")).toThrowError(InvalidStateException);
    expect(() => n.append("s")).toThrowError(InvalidStateException);
    expect(() => n.remove(0)).toThrowError(InvalidStateException);
    expect(() => n.concat(new StringArrayName([""]))).toThrowError(InvalidStateException);

    n = new StringArrayName(["oss", "cs"]);
    (n["components"] as any) = [1, 2, 3];
    expect(() => n.getNoComponents()).toThrowError(InvalidStateException);
    expect(() => n.getComponent(0)).toThrowError(InvalidStateException);
    expect(() => n.setComponent(0, "s")).toThrowError(InvalidStateException);
    expect(() => n.insert(0, "s")).toThrowError(InvalidStateException);
    expect(() => n.append("s")).toThrowError(InvalidStateException);
    expect(() => n.remove(0)).toThrowError(InvalidStateException);

    n = new StringArrayName(["oss", "cs"]);
    (n["components"] as any) = {};
    expect(() => n.getNoComponents()).toThrowError(InvalidStateException);
    expect(() => n.getComponent(0)).toThrowError(InvalidStateException);
    expect(() => n.setComponent(0, "s")).toThrowError(InvalidStateException);
    expect(() => n.insert(0, "s")).toThrowError(InvalidStateException);
    expect(() => n.append("s")).toThrowError(InvalidStateException);
    expect(() => n.remove(0)).toThrowError(InvalidStateException);
  });

  it("test asString()", () => {
    // precondition
    let n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.asString("delimiter")).toThrowError(IllegalArgumentException);

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringArrayName(["oss", "cs", "fau", "de"], "_");
    expect(n.asString()).toBe("oss_cs_fau_de");

    n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
    expect(n.asString("@")).toBe("oss.cs@fau.de");

    n = new StringArrayName(["oss@cs", "fau@de"]);
    expect(n.asString("@")).toBe("oss@cs@fau@de");

    n = new StringArrayName(["", "", ""]);
    expect(n.asString()).toBe("..");

    n = new StringArrayName(["oss.cs.fau.de"], "#");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test toString()", () => {
    let n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.asDataString()).toBe("oss.cs.fau.de");
    let n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());

    n = new StringArrayName(["oss", "cs", "fau", "de"], "_");
    expect(n.asDataString()).toBe("oss.cs.fau.de");

    n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
    expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());

    n = new StringArrayName(["oss.cs", "fau.de"], "@");
    expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");

    n = new StringArrayName(["", "", ""]);
    expect(n.asDataString()).toBe("..");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());

    n = new StringArrayName(["oss.cs.fau.de"], "#");
    expect(n.asDataString()).toBe("oss\\.cs\\.fau\\.de");
    expect(n.getNoComponents()).toBe(1);

    n = new StringArrayName(["m.y", "n\\,a\\\\m.e"], ",");
    expect(n.asDataString()).toBe("m\\.y.n,a\\\\m\\.e");
  });

  it("test asDataString()", () => {
    let n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.asDataString()).toBe("oss.cs.fau.de");
    let n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());

    n = new StringArrayName(["oss", "cs", "fau", "de"], "_");
    expect(n.asDataString()).toBe("oss.cs.fau.de");

    n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
    expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());

    n = new StringArrayName(["oss.cs", "fau.de"], "@");
    expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");

    n = new StringArrayName(["", "", ""]);
    expect(n.asDataString()).toBe("..");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());

    n = new StringArrayName(["oss.cs.fau.de"], "#");
    expect(n.asDataString()).toBe("oss\\.cs\\.fau\\.de");
    expect(n.getNoComponents()).toBe(1);

    n = new StringArrayName(["m.y", "n\\,a\\\\m.e"], ",");
    expect(n.asDataString()).toBe("m\\.y.n,a\\\\m\\.e");
  });

  it("test isEmpty()", () => {
    let n = new StringArrayName([""]);
    expect(n.isEmpty()).toBe(false);
    n.remove(0);
    expect(n.isEmpty()).toBe(true);
  });

  it("test getDelimiterCharacter()", () => {
    let n = new StringArrayName(["oss", "cs"]);
    expect(n.getDelimiterCharacter()).toBe(".");

    n = new StringArrayName(["oss", "cs"], "@");
    expect(n.getDelimiterCharacter()).toBe("@");

    n = new StringArrayName(["", "", "", ""], "/");
    expect(n.getDelimiterCharacter()).toBe("/");

    n = new StringArrayName(["Oh\\.\\.\\."]);
    expect(n.getDelimiterCharacter()).toBe(".");
  });

  it("test getNoComponents()", () => {
    let n = new StringArrayName(["oss"]);
    n.remove(0);
    expect(n.getNoComponents()).toBe(0);

    n = new StringArrayName(["oss"]);
    expect(n.getNoComponents()).toBe(1);

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.getNoComponents()).toBe(4);

    n = new StringArrayName(["oss.cs.fau.de"], "#");
    expect(n.getNoComponents()).toBe(1);

    n = new StringArrayName(["", "", "", ""], "/");
    expect(n.getNoComponents()).toBe(4);

    n = new StringArrayName(["Oh\\.\\.\\."]);
    expect(n.getNoComponents()).toBe(1);
  });

  it("test getComponent()", () => {
    // precondition
    let n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.getComponent(4)).toThrowError(IllegalArgumentException);
    expect(() => n.getComponent(-1)).toThrowError(IllegalArgumentException);

    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(3)).toBe("de");
  });

  it("test setComponent()", () => {
    // precondition
    let n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.setComponent(-1, "spam")).toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(0, ".")).toThrowError(IllegalArgumentException);

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.setComponent(0, "cip");
    expect(n.asString()).toBe("cip.cs.fau.de");

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.setComponent(3, "org");
    expect(n.asString()).toBe("oss.cs.fau.org");

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.setComponent(4, "spam")).toThrowError(IllegalArgumentException);

  });

  it("test insert()", () => {
    // precondition
    let n = new StringArrayName(["oss", "cs", "fau"]);
    expect(() => n.insert(-1, "oss")).toThrowError(IllegalArgumentException);
    expect(() => n.insert(4, "oss")).toThrowError(IllegalArgumentException);
    expect(() => n.insert(0, ".")).toThrowError(IllegalArgumentException);

    n = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringArrayName(["oss.fau.de"], "@");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.fau.de@cs");

    n = new StringArrayName(["oss", "cs", "de"]);
    n.insert(2, "fau");
    expect(n.asString()).toBe("oss.cs.fau.de")

    n = new StringArrayName(["oss", "cs", "fau"]);
    n.insert(3, "de");
    expect(n.asString()).toBe("oss.cs.fau.de")
  });

  it("test append()", () => {
    // precondition
    let n = new StringArrayName(["oss", "cs", "fau"]);
    expect(() => n.append(".")).toThrowError(IllegalArgumentException);

    n = new StringArrayName(["oss.cs.fau.de"], "#");
    expect(() => n.append("#")).toThrowError(IllegalArgumentException);

    n = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringArrayName(["oss.cs.fau.de"], "#");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");

  });

  it("test remove()", () => {
    // precondition
    let n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.remove(-1)).toThrowError(IllegalArgumentException);

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.remove(27)).toThrowError(IllegalArgumentException);

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(3);
    expect(n.asString()).toBe("oss.cs.fau");


    n = new StringArrayName(["oss"]);
    n.remove(0);
    expect(n.asString()).toBe("");

    // remove from empty name (precondition)
    expect(() => n.remove(0)).toThrowError(IllegalArgumentException);

    n = new StringArrayName(["oss.cs.fau.de", "people"], "#");
    n.remove(0);
    expect(n.asString()).toBe("people");

    n = new StringArrayName(["oss\\#cs\\#fau\\#de", "people"], "#");
    n.remove(0);
    expect(n.asString()).toBe("people");
  });

  it("test concat()", () => {
    // precondition
    let n = new StringArrayName(["oss", "cs"]);
    expect(() => n.concat({} as any)).toThrowError(IllegalArgumentException);
    expect(() => n.concat(Object.setPrototypeOf({}, StringArrayName))).toThrowError(IllegalArgumentException);

    n = new StringArrayName(["oss", "cs"]);
    n.concat(new StringArrayName(["fau", "de"]));
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringArrayName(["oss", "cs"]);
    n.concat(new StringName("fau.de"));
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringArrayName(["oss\\@cs"], "@");
    n.concat(new StringArrayName(["fau@de"]));
    expect(n.asDataString()).toBe("oss@cs.fau@de");

    n = new StringArrayName(["oss\\.tf", "cs"]);
    n.concat(new StringArrayName(["fau", "de"]));
    expect(n.asDataString()).toBe("oss\\.tf.cs.fau.de");

    n = new StringArrayName(["oss", "cs"]);
    n.concat(new StringName("fau@de"));
    expect(n.asString()).toBe("oss.cs.fau@de");

    n = new StringArrayName(["oss", "cs"], "/");
    n.concat(new StringArrayName(["fau\\/", "de"], "/"));
    expect(n.asDataString()).toBe("oss.cs.fau/.de");
  });

  it("test getHashCode()", () => {
    let n: AbstractName = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: AbstractName = new StringName("oss.cs.fau.de");
    let n3: AbstractName = new StringName("oss.cs.fau.de", "/");
    expect(n.getHashCode()).toBe(n2.getHashCode());
    expect(n.getHashCode() === n3.getHashCode()).toBe(false);
    expect(n2.getHashCode() === n3.getHashCode()).toBe(false);

    n = new StringArrayName(["oss", "cs", "fau", "de"], "_");
    n2 = new StringArrayName(["oss", "cs", "fau", "de"], "_");
    n3 = new StringName("oss_cs_fau_de", "_");
    expect(n.getHashCode()).toBe(n2.getHashCode());
    expect(n.getHashCode()).toBe(n3.getHashCode());

    n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
    n2 = new StringName("oss\\.cs.fau\\.de");
    n3 = new StringArrayName(["oss", "cs", "fau\\.de"]);
    expect(n.getHashCode()).toBe(n2.getHashCode());
    expect(n.getHashCode() === n3.getHashCode()).toBe(false);

    n = new StringArrayName(["m.y", "n\\,a\\\\m.e"], ",");
    n2 = new StringArrayName(["m.y", "n\\,a\\\\m.e"], ",");
    n3 = new StringName("m.y,n\\,a\\\\m.e", ",");
    expect(n.getHashCode()).toBe(n2.getHashCode());
    expect(n.getHashCode()).toBe(n3.getHashCode());
  });

  it("test isEqual()", () => {
    // precondition
    let n: AbstractName = new StringArrayName(["oss", "cs"]);
    expect(() => n.isEqual({} as any)).toThrowError(IllegalArgumentException);
    expect(() => n.isEqual(Object.setPrototypeOf({}, StringArrayName))).toThrowError(IllegalArgumentException);

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: AbstractName = new StringName("oss.cs.fau.de");
    let n3: AbstractName = new StringName("oss.cs.fau.de", "/");
    expect(n.isEqual(n2)).toBe(true);
    expect(n2.isEqual(n)).toBe(true);
    expect(n.isEqual(n3)).toBe(false);
    expect(n3.isEqual(n)).toBe(false);
    expect(n2.isEqual(n3)).toBe(false);
    expect(n3.isEqual(n2)).toBe(false);

    n = new StringArrayName(["oss", "cs", "fau", "de"], "_");
    n2 = new StringArrayName(["oss", "cs", "fau", "de"], "_");
    n3 = new StringName("oss_cs_fau_de", "_");
    expect(n.isEqual(n2)).toBe(true);
    expect(n.isEqual(n3)).toBe(true);

    n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
    n2 = new StringName("oss\\.cs.fau\\.de");
    n3 = new StringArrayName(["oss", "cs", "fau\\.de"]);
    expect(n.isEqual(n2)).toBe(true);
    expect(n.isEqual(n3)).toBe(false);

    n = new StringArrayName(["m.y", "n\\,a\\\\m.e"], ",");
    n2 = new StringArrayName(["m.y", "n\\,a\\\\m.e"], ",");
    n3 = new StringName("m.y,n\\,a\\\\m.e", ",");
    expect(n.isEqual(n2)).toBe(true);
    expect(n.isEqual(n3)).toBe(true);
  });

  it("test clone()", () => {
    let n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.clone().isEqual(n)).toBe(true);

    n = new StringArrayName(["oss", "cs", "fau", "de"], "_");
    expect(n.clone().isEqual(n)).toBe(true);

    n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
    expect(n.clone().isEqual(n)).toBe(true);

    n = new StringArrayName(["oss.cs", "fau.de"], "@");
    expect(n.clone().isEqual(n)).toBe(true);

    n = new StringArrayName(["", "", ""]);
    expect(n.clone().isEqual(n)).toBe(true);

    n = new StringArrayName(["oss.cs.fau.de"], "#");
    expect(n.clone().isEqual(n)).toBe(true);

    n = new StringArrayName(["m.y", "n\\,a\\\\m.e"], ",");
    expect(n.clone().isEqual(n)).toBe(true);
  });
});