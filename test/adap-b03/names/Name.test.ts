import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";
import { AbstractName } from "../../../src/adap-b03/names/AbstractName";


describe("StringArrayName Tests", () => {
  it("test invalid construction", () => {
    // https://www.studon.fau.de/frm4447999_385940.html
    // "Ich denke, eine leeres string array zu uebergeben
    // sollte nicht erlaubt sein (im Constructor)."
    expect(() => new StringArrayName([])).toThrowError();
  });

  it("test asString()", () => {
    let n = new StringArrayName(["oss", "cs", "fau", "de"]);
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
    expect(n.asDataString()).toBe("oss_cs_fau_de");
    n2 = new StringName(n.asDataString(), "_");
    expect(n.getNoComponents()).toBe(n2.getNoComponents());
    
    n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
    expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());
    
    n = new StringArrayName(["oss.cs", "fau.de"], "@");
    expect(n.asDataString()).toBe("oss.cs@fau.de");
    
    n = new StringArrayName(["", "", ""]);
    expect(n.asDataString()).toBe("..");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());
    
    n = new StringArrayName(["oss.cs.fau.de"], "#");
    expect(n.asDataString()).toBe("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(1);

    n = new StringArrayName(["m.y", "n\\,a\\\\m\\.e"], ",");
    expect(n.asDataString()).toBe("m.y,n\\,a\\\\m\\.e");
  });

  it("test asDataString()", () => {
    let n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.asDataString()).toBe("oss.cs.fau.de");
    let n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());
    
    n = new StringArrayName(["oss", "cs", "fau", "de"], "_");
    expect(n.asDataString()).toBe("oss_cs_fau_de");
    n2 = new StringName(n.asDataString(), "_");
    expect(n.getNoComponents()).toBe(n2.getNoComponents());
    
    n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
    expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());
    
    n = new StringArrayName(["oss.cs", "fau.de"], "@");
    expect(n.asDataString()).toBe("oss.cs@fau.de");
    
    n = new StringArrayName(["", "", ""]);
    expect(n.asDataString()).toBe("..");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());
    
    n = new StringArrayName(["oss.cs.fau.de"], "#");
    expect(n.asDataString()).toBe("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(1);

    n = new StringArrayName(["m.y", "n\\,a\\\\m\\.e"], ",");
    expect(n.asDataString()).toBe("m.y,n\\,a\\\\m\\.e");
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
    let n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(3)).toBe("de");

    // out of index:
    expect(() => n.getComponent(4)).toThrowError();
    expect(() => n.getComponent(-1)).toThrowError();
  });

  it("test setComponent()", () => {
    let n = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.setComponent(0, "cip");
    expect(n.asString()).toBe("cip.cs.fau.de");

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.setComponent(3, "org");
    expect(n.asString()).toBe("oss.cs.fau.org");

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.setComponent(4, "spam")).toThrowError();

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.setComponent(-1, "spam")).toThrowError();
  });

  it("test insert()", () => {
    let n = new StringArrayName(["oss", "fau", "de"]);
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

    n = new StringArrayName(["oss", "cs", "fau"]);
    expect(() => n.insert(-1, "oss")).toThrowError();
  });

  it("test append()", () => {
    let n = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringArrayName(["oss.cs.fau.de"], "#");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });

  it("test remove()", () => {
    let n = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(3);
    expect(n.asString()).toBe("oss.cs.fau");

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.remove(-1)).toThrowError();

    n = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(() => n.remove(27)).toThrowError();

    n = new StringArrayName(["oss"]);
    n.remove(0);
    expect(n.asString()).toBe("");
    
    // remove from empty name
    expect(() => n.remove(0)).toThrowError();

    n = new StringArrayName(["oss.cs.fau.de", "people"], "#");
    n.remove(0);
    expect(n.asString()).toBe("people");

    n = new StringArrayName(["oss\\#cs\\#fau\\#de", "people"], "#");
    n.remove(0);
    expect(n.asString()).toBe("people");
  });

  it("test concat()", () => {
    let n = new StringArrayName(["oss", "cs"]);
    n.concat(new StringArrayName(["fau", "de"]));
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringArrayName(["oss", "cs"]);
    n.concat(new StringName("fau.de"));
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringArrayName(["oss\\@cs"], "@");
    n.concat(new StringArrayName(["fau@de"]));
    expect(n.asDataString()).toBe("oss\\@cs@fau\\@de");

    n = new StringArrayName(["oss\\.tf", "cs"]);
    n.concat(new StringArrayName(["fau", "de"]));
    expect(n.asDataString()).toBe("oss\\.tf.cs.fau.de");

    n = new StringArrayName(["oss", "cs"]);
    n.concat(new StringName("fau@de"));
    expect(n.asString()).toBe("oss.cs.fau@de");

    n = new StringArrayName(["oss", "cs"], "/");
    n.concat(new StringArrayName(["fau\\/", "de"], "/"));
    expect(n.asDataString()).toBe("oss/cs/fau\\//de");
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
    
    n = new StringArrayName(["m.y", "n\\,a\\\\m\\.e"], ",");
    n2 = new StringArrayName(["m.y", "n\\,a\\\\m\\.e"], ",");
    n3 = new StringName("m.y,n\\,a\\\\m\\.e", ",");
    expect(n.getHashCode()).toBe(n2.getHashCode());
    expect(n.getHashCode()).toBe(n3.getHashCode());
  });

  it("test isEqual()", () => {
    let n: AbstractName = new StringArrayName(["oss", "cs", "fau", "de"]);
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
    
    n = new StringArrayName(["m.y", "n\\,a\\\\m\\.e"], ",");
    n2 = new StringArrayName(["m.y", "n\\,a\\\\m\\.e"], ",");
    n3 = new StringName("m.y,n\\,a\\\\m\\.e", ",");
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
    
    n = new StringArrayName(["m.y", "n\\,a\\\\m\\.e"], ",");
    expect(n.clone().isEqual(n)).toBe(true);
  });
});

describe("StringName Tests", () => {
  it("test asString()", () => {
    let n = new StringName("oss.cs.fau.de");
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
    expect(n.asDataString()).toBe("oss_cs_fau_de");
    
    n = new StringName("oss\\.cs.fau\\.de");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());
    
    n = new StringName("oss.cs@fau.de", "@");
    expect(n.asDataString()).toBe("oss.cs@fau.de");
    
    n = new StringName("..");
    expect(n.asDataString()).toBe("..");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());
    
    n = new StringName("oss.cs.fau.de", "#");
    n2 = new StringName(n.asDataString(), "#");
    expect(n.asDataString()).toBe("oss.cs.fau.de");

    // edge case
    n = new StringName("");
    n.remove(0);
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe("");
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(0);
    expect(n2.getNoComponents()).toBe(1);

    n = new StringName("m.y,n\\,a\\\\m\\.e", ",");
    expect(n.asDataString()).toBe("m.y,n\\,a\\\\m\\.e");
  });

  it("test asDataString()", () => {
    let n = new StringName("oss.cs.fau.de");
    expect(n.asDataString()).toBe("oss.cs.fau.de");
    let n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());
    
    n = new StringName("oss_cs_fau_de", "_");
    expect(n.asDataString()).toBe("oss_cs_fau_de");
    
    n = new StringName("oss\\.cs.fau\\.de");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());
    
    n = new StringName("oss.cs@fau.de", "@");
    expect(n.asDataString()).toBe("oss.cs@fau.de");
    
    n = new StringName("..");
    expect(n.asDataString()).toBe("..");
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(n2.getNoComponents());
    
    n = new StringName("oss.cs.fau.de", "#");
    n2 = new StringName(n.asDataString(), "#");
    expect(n.asDataString()).toBe("oss.cs.fau.de");

    // edge case
    n = new StringName("");
    n.remove(0);
    n2 = new StringName(n.asDataString());
    expect(n.asDataString()).toBe("");
    expect(n.asDataString()).toBe(n2.asDataString());
    expect(n.getNoComponents()).toBe(0);
    expect(n2.getNoComponents()).toBe(1);

    n = new StringName("m.y,n\\,a\\\\m\\.e", ",");
    expect(n.asDataString()).toBe("m.y,n\\,a\\\\m\\.e");
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
    let n = new StringName("oss.cs.fau.de");
    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(3)).toBe("de");
    // out of index:
    expect(() => n.getComponent(4)).toThrowError();
    expect(() => n.getComponent(-1)).toThrowError();
  });

  it("test setComponent()", () => {
    let n = new StringName("oss.cs.fau.de");
    n.setComponent(0, "cip");
    expect(n.asString()).toBe("cip.cs.fau.de");

    n = new StringName("oss.cs.fau.de");
    n.setComponent(3, "org");
    expect(n.asString()).toBe("oss.cs.fau.org");

    n = new StringName("oss.cs.fau.de");
    expect(() => n.setComponent(4, "spam")).toThrowError();

    n = new StringName("oss.cs.fau.de");
    expect(() => n.setComponent(-1, "spam")).toThrowError();
  });

  it("test insert()", () => {
    let n = new StringName("oss.fau.de");
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

    n = new StringName("");
    expect(() => n.insert(-1, "oss")).toThrowError();
  });

  it("test append()", () => {
    let n = new StringName("oss.cs.fau");
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
    let n = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");

    n = new StringName("oss.cs.fau.de");
    n.remove(3);
    expect(n.asString()).toBe("oss.cs.fau");

    n = new StringName("oss.cs.fau.de");
    expect(() => n.remove(-1)).toThrowError();

    n = new StringName("oss.cs.fau.de");
    expect(() => n.remove(27)).toThrowError();

    
    n = new StringName("oss");
    n.remove(0);
    expect(n.asDataString()).toBe("");

    // edge case
    n = new StringName("");
    n.remove(0);
    expect(n.asDataString()).toBe("");
    expect(() => n.remove(0)).toThrowError();

    n = new StringName("oss.cs.fau.de#people", "#");
    n.remove(0);
    expect(n.asString()).toBe("people");

    n = new StringName("oss\\#cs\\#fau\\#de#people", "#");
    n.remove(0);
    expect(n.asString()).toBe("people");
  });

  it("test concat()", () => {
    let n = new StringName("oss.cs");
    n.concat(new StringName("fau.de"));
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringName("oss.cs");
    n.concat(new StringArrayName(["fau", "de"]));
    expect(n.asString()).toBe("oss.cs.fau.de");

    n = new StringName("oss@cs", "@");
    n.concat(new StringName("fau.de"));
    expect(n.asDataString()).toBe("oss@cs@fau@de");

    n = new StringName("oss\\@cs", "@");
    n.concat(new StringName("fau@de"))
    expect(n.asDataString()).toBe("oss\\@cs@fau\\@de");

    n = new StringName("oss\\.tf.cs");
    n.concat(new StringName("fau.de"));
    expect(n.asDataString()).toBe("oss\\.tf.cs.fau.de");

    n = new StringName("oss.cs");
    n.concat(new StringArrayName(["fau@de"]));
    expect(n.asString()).toBe("oss.cs.fau@de");

    n = new StringName("oss/cs", "/");
    n.concat(new StringName("fau\\/de", "/"));
    expect(n.asDataString()).toBe("oss/cs/fau\\/de");
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
    
    n = new StringName("m.y,n\\,a\\\\m\\.e", ",");
    n2 = new StringArrayName(["m.y", "n\\,a\\\\m\\.e"], ",");
    n3 = new StringArrayName(["m.y", "n\\,a\\\\m\.e"], ",");
    expect(n.getHashCode()).toBe(n2.getHashCode());
    expect(n.getHashCode() === n3.getHashCode()).toBe(false);
  });

  it("test isEqual()", () => {
    let n: AbstractName = new StringArrayName(["oss", "cs", "fau", "de"]);
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
    
    n = new StringName("m.y,n\\,a\\\\m\\.e", ",");
    n2 = new StringArrayName(["m.y", "n\\,a\\\\m\\.e"], ",");
    n3 = new StringArrayName(["m.y", "n\\,a\\m\\.e"], ",");
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
    
    n = new StringName("m.y,n\\,a\\\\m\\.e", ",");
    expect(n.clone().isEqual(n)).toBe(true);
  });
});