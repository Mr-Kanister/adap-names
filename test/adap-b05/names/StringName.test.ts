import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b05/names/StringName";
import { StringArrayName } from "../../../src/adap-b05/names/StringArrayName";
import { AbstractName } from "../../../src/adap-b05/names/AbstractName";
import { IllegalArgumentException } from "../../../src/adap-b05/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";

function assertAllInvalidState(n: AbstractName) {
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
}

describe("StringName Tests", () => {
  it("test class invariant", () => {
    let n = new StringName("oss.cs");
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

    n = new StringName("oss.cs");
    (n["name"] as any) = [1, 2, 3];
    expect(() => n.getNoComponents()).toThrowError(InvalidStateException);
    expect(() => n.getComponent(0)).toThrowError(InvalidStateException);
    expect(() => n.setComponent(0, "s")).toThrowError(InvalidStateException);
    expect(() => n.insert(0, "s")).toThrowError(InvalidStateException);
    expect(() => n.append("s")).toThrowError(InvalidStateException);
    expect(() => n.remove(0)).toThrowError(InvalidStateException);

    n = new StringName("oss.cs");
    (n["noComponents"] as any) = {};
    expect(() => n.getNoComponents()).toThrowError(InvalidStateException);
    expect(() => n.getComponent(0)).toThrowError(InvalidStateException);
    expect(() => n.setComponent(0, "s")).toThrowError(InvalidStateException);
    expect(() => n.insert(0, "s")).toThrowError(InvalidStateException);
    expect(() => n.append("s")).toThrowError(InvalidStateException);
    expect(() => n.remove(0)).toThrowError(InvalidStateException);
  });

  it("test asString()", () => {
    // preconditon
    let n = new StringName("oss.cs.fau.de");
    expect(() => n.asString("delimiter")).toThrowError(IllegalArgumentException);

    n = new StringName("oss.cs.fau.de");
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringName("oss_cs_fau_de", "_");
    expect(n.asString()).toBe("oss_cs_fau_de");

    n = new StringName("oss\\.cs.fau.de");
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringName("oss\\.cs.fau\\.de");
    expect(n.asString("@")).toBe("oss.cs@fau.de");

    n = new StringName("oss@cs.fau@de");
    expect(n.asString("@")).toBe("oss@cs@fau@de");

    n = new StringName("..");
    expect(n.asString()).toBe("..");

    n = new StringName("oss.cs.fau.de", "#");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test toString()", () => {
    let n = new StringName("oss.cs.fau.de");
    expect(n.asDataString()).toBe("oss.cs.fau.de");
    let n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());

    n = new StringName("oss_cs_fau_de", "_");
    expect(n.asDataString()).toBe("oss.cs.fau.de");

    n = new StringName("oss\\.cs.fau\\.de");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());

    n = new StringName("oss.cs@fau.de", "@");
    expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");

    n = new StringName("..");
    expect(n.asDataString()).toBe("..");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());

    n = new StringName("oss.cs.fau.de", "#");
    n2 = new StringName(n.asDataString(), "#");
    expect(n.asDataString()).toBe("oss\\.cs\\.fau\\.de");

    // edge case
    n = new StringName("");
    n.remove(0);
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe("");
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(0);
    expect(n2.getNoComponents()).toBe(1);

    n = new StringName("m.y,n\\,a\\\\m.e", ",");
    expect(n.asDataString()).toBe("m\\.y.n,a\\\\m\\.e");
  });

  it("test asDataString()", () => {
    let n = new StringName("oss.cs.fau.de");
    expect(n.asDataString()).toBe("oss.cs.fau.de");
    let n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());

    n = new StringName("oss_cs_fau_de", "_");
    expect(n.asDataString()).toBe("oss.cs.fau.de");

    n = new StringName("oss\\.cs.fau\\.de");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());

    n = new StringName("oss.cs@fau.de", "@");
    expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");

    n = new StringName("..");
    expect(n.asDataString()).toBe("..");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());

    n = new StringName("oss.cs.fau.de", "#");
    n2 = new StringName(n.asDataString(), "#");
    expect(n.asDataString()).toBe("oss\\.cs\\.fau\\.de");

    // edge case
    n = new StringName("");
    n.remove(0);
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe("");
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(0);
    expect(n2.getNoComponents()).toBe(1);

    n = new StringName("m.y,n\\,a\\\\m.e", ",");
    expect(n.asDataString()).toBe("m\\.y.n,a\\\\m\\.e");
  });

  it("test isEmpty()", () => {
    let n = new StringName("");
    expect(n.isEmpty()).toBe(false);
    n.remove(0);
    expect(n.isEmpty()).toBe(true);
  });

  it("test getDelimiterCharacter()", () => {
    let n = new StringName("oss.cs");
    expect(n.getDelimiterCharacter()).toBe(".");

    n = new StringName("oss.cs", "@");
    expect(n.getDelimiterCharacter()).toBe("@");

    n = new StringName("///", "/");
    expect(n.getDelimiterCharacter()).toBe("/");

    n = new StringName("Oh\\.\\.\\.");
    expect(n.getDelimiterCharacter()).toBe(".");
  });

  it("test getNoComponents()", () => {
    let n = new StringName("");
    expect(n.getNoComponents()).toBe(1);
    n.remove(0);
    expect(n.getNoComponents()).toBe(0);

    n = new StringName("oss");
    expect(n.getNoComponents()).toBe(1);

    n = new StringName("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(4);

    n = new StringName("oss.cs.fau.de", "#");
    expect(n.getNoComponents()).toBe(1);

    n = new StringName("///", "/");
    expect(n.getNoComponents()).toBe(4);

    n = new StringName("Oh\\.\\.\\.");
    expect(n.getNoComponents()).toBe(1);
  });

  it("test getComponent()", () => {
    // precondition
    let n = new StringName("oss.cs.fau.de");
    expect(() => n.getComponent(-1)).toThrowError(IllegalArgumentException);
    expect(() => n.getComponent(4)).toThrowError(IllegalArgumentException);

    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(3)).toBe("de");
  });

  it("test setComponent()", () => {
    // precondition
    let n = new StringName("oss.cs.fau.de");
    expect(() => n.setComponent(4, "spam")).toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(-1, "spam")).toThrowError(IllegalArgumentException);
    expect(() => n.setComponent(0, ".")).toThrowError(IllegalArgumentException);

    n.setComponent(0, "cip");

    expect(n.asString()).toBe("cip.cs.fau.de");

    n = new StringName("oss.cs.fau.de");
    n.setComponent(3, "org");
    expect(n.asString()).toBe("oss.cs.fau.org");

  });

  it("test insert()", () => {
    // precondition
    let n = new StringName("oss.fau.de");
    expect(() => n.insert(-1, "oss")).toThrowError(IllegalArgumentException);
    expect(() => n.insert(5, "oss")).toThrowError(IllegalArgumentException);
    expect(() => n.insert(0, ".")).toThrowError(IllegalArgumentException);

    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringName("oss.fau.de", "@");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.fau.de@cs");

    n = new StringName("oss.fau.de", "#");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.fau.de#cs");

    n = new StringName("");
    n.insert(0, "oss");
    expect(n.asString()).toBe("oss.");

    n = new StringName("");
    n.insert(1, "oss");
    expect(n.asString()).toBe(".oss");

    n = new StringName("oss.cs.de");
    n.insert(2, "fau");
    expect(n.asString()).toBe("oss.cs.fau.de")

    n = new StringName("oss.cs.fau");
    n.insert(3, "de");
    expect(n.asString()).toBe("oss.cs.fau.de")
  });

  it("test append()", () => {
    // precondition
    let n = new StringName("");
    expect(() => n.append(".")).toThrowError(IllegalArgumentException);

    n = new StringName("oss.cs.fau.de", "#");
    expect(() => n.append("#")).toThrowError(IllegalArgumentException);

    n = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringName("");
    n.append("oss");
    expect(n.asString()).toBe(".oss")

    n = new StringName("oss.cs.fau.de", "#");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");

  });

  it("test remove()", () => {
    // precondition
    let n = new StringName("oss.cs.fau.de");
    expect(() => n.remove(-1)).toThrow();

    n = new StringName("oss.cs.fau.de");
    expect(() => n.remove(27)).toThrow();

    n = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");

    n = new StringName("oss.cs.fau.de");
    n.remove(3);
    expect(n.asString()).toBe("oss.cs.fau");

    n = new StringName("oss");
    n.remove(0);
    expect(n.asDataString()).toBe("");

    n = new StringName("");
    n.remove(0);
    expect(n.asDataString()).toBe("");
    // precondition
    expect(() => n.remove(0)).toThrowError(IllegalArgumentException)

    n = new StringName("oss.cs.fau.de#people", "#");
    n.remove(0);
    expect(n.asString()).toBe("people");

    n = new StringName("oss\\#cs\\#fau\\#de#people", "#");
    n.remove(0);
    expect(n.asString()).toBe("people");
  });

  it("test concat()", () => {
    // precondition
    let n = new StringName("oss.cs");
    expect(() => n.concat({} as any)).toThrowError(IllegalArgumentException);
    expect(() => n.concat(Object.setPrototypeOf({}, StringArrayName))).toThrowError(IllegalArgumentException);

    n = new StringName("oss.cs");
    n.concat(new StringName("fau.de"));
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringName("oss.cs");
    n.concat(new StringArrayName(["fau", "de"]));
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringName("oss@cs", "@");
    n.concat(new StringName("fau.de"));
    expect(n.asDataString()).toBe("oss.cs.fau.de");

    n = new StringName("oss\\@cs", "@");
    n.concat(new StringName("fau@de"))
    expect(n.asDataString()).toBe("oss@cs.fau@de");

    n = new StringName("oss\\.tf.cs");
    n.concat(new StringName("fau.de"));
    expect(n.asDataString()).toBe("oss\\.tf.cs.fau.de");

    n = new StringName("oss.cs");
    n.concat(new StringArrayName(["fau@de"]));
    expect(n.asString()).toBe("oss.cs.fau@de");

    n = new StringName("oss/cs", "/");
    n.concat(new StringName("fau\\/de", "/"));
    expect(n.asDataString()).toBe("oss.cs.fau/de");
  });

  it("test getHashCode()", () => {
    let n: AbstractName = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: AbstractName = new StringName("oss.cs.fau.de");
    let n3: AbstractName = new StringName("oss.cs.fau.de", "/");
    expect(n.getHashCode()).toBe(n2.getHashCode());
    expect(n.getHashCode() === n3.getHashCode()).toBe(false);
    expect(n2.getHashCode() === n3.getHashCode()).toBe(false);

    n = new StringName("oss_cs_fau_de", "_");
    n2 = new StringArrayName(["oss", "cs", "fau", "de"], "_");
    n3 = new StringArrayName(["oss", "cs", "fau", "de"], "_");
    expect(n.getHashCode()).toBe(n2.getHashCode());
    expect(n.getHashCode()).toBe(n3.getHashCode());

    n = new StringName("oss\\.cs.fau\\.de");
    n2 = new StringArrayName(["oss\\.cs", "fau\\.de"]);
    n3 = new StringArrayName(["oss", "cs", "fau\\.de"]);
    expect(n.getHashCode()).toBe(n2.getHashCode());
    expect(n.getHashCode() === n3.getHashCode()).toBe(false);

    n = new StringName("m.y,n\\,a\\\\m.e", ",");
    n2 = new StringArrayName(["m.y", "n\\,a\\\\m.e"], ",");
    n3 = new StringArrayName(["m.y", "n\\,am.e"], ",");
    expect(n.getHashCode()).toBe(n2.getHashCode());
    expect(n.getHashCode() === n3.getHashCode()).toBe(false);
  });

  it("test isEqual()", () => {
    // precondition
    let n: AbstractName = new StringName("oss.cs");
    expect(() => n.concat({} as any)).toThrowError(IllegalArgumentException);
    expect(() => n.concat(Object.setPrototypeOf({}, StringArrayName))).toThrowError(IllegalArgumentException);


    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: AbstractName = new StringName("oss.cs.fau.de");
    let n3: AbstractName = new StringName("oss.cs.fau.de", "/");
    expect(n.isEqual(n2)).toBe(true);
    expect(n2.isEqual(n)).toBe(true);
    expect(n.isEqual(n3)).toBe(false);
    expect(n3.isEqual(n)).toBe(false);
    expect(n2.isEqual(n3)).toBe(false);
    expect(n3.isEqual(n2)).toBe(false);

    n = new StringName("oss_cs_fau_de", "_");
    n2 = new StringArrayName(["oss", "cs", "fau", "de"], "_");
    n3 = new StringArrayName(["oss", "cs", "fau", "de"], "_");
    expect(n.isEqual(n2)).toBe(true);
    expect(n.isEqual(n3)).toBe(true);

    n = new StringName("oss\\.cs.fau\\.de");
    n2 = new StringArrayName(["oss\\.cs", "fau\\.de"]);
    n3 = new StringArrayName(["oss", "cs", "fau\\.de"]);
    expect(n.isEqual(n2)).toBe(true);
    expect(n.isEqual(n3)).toBe(false);

    n = new StringName("m.y,n\\,a\\\\m.e", ",");
    n2 = new StringArrayName(["m.y", "n\\,a\\\\m.e"], ",");
    n3 = new StringArrayName(["m.y", "n\\,am.e"], ",");
    expect(n.isEqual(n2)).toBe(true);
    expect(n.isEqual(n3)).toBe(false);
  });

  it("test clone()", () => {
    let n = new StringName("oss.cs.fau.de");
    expect(n.clone().isEqual(n)).toBe(true);

    n = new StringName("oss_cs_fau_de", "_");
    expect(n.clone().isEqual(n)).toBe(true);

    n = new StringName("oss\\.cs.fau\\.de");
    expect(n.clone().isEqual(n)).toBe(true);

    n = new StringName("oss.cs@fau.de", "@");
    expect(n.clone().isEqual(n)).toBe(true);

    n = new StringName("..");
    expect(n.clone().isEqual(n)).toBe(true);

    n = new StringName("oss.cs.fau.de", "#");
    expect(n.clone().isEqual(n)).toBe(true);

    // edge case
    n = new StringName("");
    expect(n.clone().isEqual(n)).toBe(true);

    n = new StringName("m.y,n\\,a\\\\m.e", ",");
    expect(n.clone().isEqual(n)).toBe(true);
  });
});
