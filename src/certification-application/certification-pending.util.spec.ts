import { isPendingFromTotalPoints } from "./certification-pending.util";

describe("isPendingFromTotalPoints", () => {
  it("is false when there are no pending points", () => {
    expect(isPendingFromTotalPoints("0")).toBe(false);
    expect(isPendingFromTotalPoints("0.00")).toBe(false);
    expect(isPendingFromTotalPoints(null)).toBe(false);
    expect(isPendingFromTotalPoints(undefined)).toBe(false);
  });

  it("is true when coordinator release leaves pending points", () => {
    expect(isPendingFromTotalPoints("0.5")).toBe(true);
    expect(isPendingFromTotalPoints("3")).toBe(true);
    expect(isPendingFromTotalPoints("12.25")).toBe(true);
  });
});
