import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const institution1 = accounts.get("wallet_1")!;
const institution2 = accounts.get("wallet_2")!;
const student1 = accounts.get("wallet_3")!;
const student2 = accounts.get("wallet_4")!;
const delegate1 = accounts.get("wallet_5")!;

describe("ClarityScribe Tests", () => {
  // Basic setup test
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  // Institution Registration Tests
  describe("Institution Registration", () => {
    it("successfully registers a new institution", () => {
      const block = simnet.callPublicFn(
        "clarity-scribe",
        "register-institution",
        [Cl.stringAscii("Test University")],
        institution1
      );
      expect(block.result).toBeOk(Cl.bool(true));
    });

    it("prevents duplicate institution registration", () => {
      const block = simnet.callPublicFn(
        "clarity-scribe",
        "register-institution",
        [Cl.stringAscii("Test University 2")],
        institution1
      );
      expect(block.result).toBeErr(Cl.uint(101)); // ERR-ALREADY-REGISTERED
    });
  });

  // Delegate Management Tests
  describe("Delegate Management", () => {
    it("successfully adds a delegate", () => {
      const block = simnet.callPublicFn(
        "clarity-scribe",
        "add-delegate",
        [
          Cl.standardPrincipal(delegate1),
          Cl.list([Cl.stringAscii("ISSUE"), Cl.stringAscii("REVOKE")]),
          Cl.uint(1000)
        ],
        institution1
      );
      expect(block.result).toBeOk(Cl.bool(true));
    });
  });

  // Credential Management Tests
  describe("Credential Management", () => {
    it("successfully issues a credential", () => {
      const block = simnet.callPublicFn(
        "clarity-scribe",
        "issue-credential",
        [
          Cl.stringAscii("CRED001"),
          Cl.standardPrincipal(student1),
          Cl.stringAscii("Computer Science"),
          Cl.uint(2024),
          Cl.stringAscii("https://metadata.url"),
          Cl.uint(1000),
          Cl.stringAscii("Bachelor")
        ],
        institution1
      );
      expect(block.result).toBeOk(Cl.bool(true));
    });

    it("successfully issues batch credentials", () => {
      const block = simnet.callPublicFn(
        "clarity-scribe",
        "batch-issue-credentials",
        [
          Cl.list([Cl.stringAscii("CRED002"), Cl.stringAscii("CRED003")]),
          Cl.list([
            Cl.standardPrincipal(student1),
            Cl.standardPrincipal(student2)
          ]),
          Cl.list([Cl.stringAscii("Mathematics"), Cl.stringAscii("Physics")]),
          Cl.list([Cl.uint(2024), Cl.uint(2024)]),
          Cl.list([
            Cl.stringAscii("https://metadata1.url"),
            Cl.stringAscii("https://metadata2.url")
          ]),
          Cl.list([Cl.uint(1000), Cl.uint(1000)]),
          Cl.list([Cl.stringAscii("Bachelor"), Cl.stringAscii("Bachelor")])
        ],
        institution1
      );
      expect(block.result).toBeOk(Cl.bool(true));
    });

    it("prevents unauthorized credential issuance", () => {
      const block = simnet.callPublicFn(
        "clarity-scribe",
        "issue-credential",
        [
          Cl.stringAscii("CRED004"),
          Cl.standardPrincipal(student1),
          Cl.stringAscii("Invalid Degree"),
          Cl.uint(2024),
          Cl.stringAscii("https://metadata.url"),
          Cl.uint(1000),
          Cl.stringAscii("Bachelor")
        ],
        student1
      );
      expect(block.result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });
  });

  // Endorsement Tests
  describe("Endorsement System", () => {
    it("successfully endorses a credential", () => {
      const block = simnet.callPublicFn(
        "clarity-scribe",
        "endorse-credential-extended",
        [
          Cl.stringAscii("CRED001"),
          Cl.standardPrincipal(student1),
          Cl.uint(5),
          Cl.stringAscii("Excellent performance"),
          Cl.stringAscii("Academic")
        ],
        institution2
      );
      expect(block.result).toBeOk(Cl.bool(true));
    });
  });

  // Read-Only Function Tests
  describe("Read-Only Functions", () => {
    it("correctly retrieves credential info", () => {
      const result = simnet.callReadOnlyFn(
        "clarity-scribe",
        "get-credential-info",
        [Cl.stringAscii("CRED001"), Cl.standardPrincipal(student1)],
        deployer
      );
      expect(result.result).not.toBeNone();
    });

    it("correctly validates credential status", () => {
      const result = simnet.callReadOnlyFn(
        "clarity-scribe",
        "is-credential-valid",
        [Cl.stringAscii("CRED001"), Cl.standardPrincipal(student1)],
        deployer
      );
      expect(result.result).toBeTruthy();
    });
  });
});