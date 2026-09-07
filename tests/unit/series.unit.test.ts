import { describe, expect, it } from "vitest";
import {
  enumerateWeekdays,
  includedDates,
  nextIncludedDate,
  occurrencesInMonth,
  sanitizeSkippedDates,
  seriesOverlapsRange,
  weekdayOf,
} from "@lib/date/series";

describe("weekdayOf", () => {
  it("should return Thursday when the ISO date is a Thursday", () => {
    expect(weekdayOf("2026-08-13")).toBe(4);
  });

  it("should return Wednesday when the ISO date is a Wednesday", () => {
    expect(weekdayOf("2026-08-12")).toBe(3);
  });
});

describe("enumerateWeekdays", () => {
  it("should return the one day when from and to are the same date", () => {
    expect(enumerateWeekdays("2026-08-13", "2026-08-13")).toEqual(["2026-08-13"]);
  });

  it("should repeat the start weekday when the range covers four weeks", () => {
    expect(enumerateWeekdays("2026-08-13", "2026-09-03")).toEqual([
      "2026-08-13",
      "2026-08-20",
      "2026-08-27",
      "2026-09-03",
    ]);
  });

  it("should return seven dates when the range covers seven weeks", () => {
    expect(enumerateWeekdays("2026-08-13", "2026-09-24")).toHaveLength(7);
  });

  it("should cross a month boundary when the range does", () => {
    expect(enumerateWeekdays("2026-10-29", "2026-11-12")).toEqual([
      "2026-10-29",
      "2026-11-05",
      "2026-11-12",
    ]);
  });

  it("should repeat Mondays when the start date is a Monday", () => {
    expect(enumerateWeekdays("2026-08-10", "2026-08-24")).toEqual([
      "2026-08-10",
      "2026-08-17",
      "2026-08-24",
    ]);
  });

  it("should stop on the last start-weekday on or before to when to is a different weekday", () => {
    expect(enumerateWeekdays("2026-08-13", "2026-08-15")).toEqual(["2026-08-13"]);
  });

  it("should return empty when to is before from", () => {
    expect(enumerateWeekdays("2026-08-20", "2026-08-13")).toEqual([]);
  });
});

describe("includedDates", () => {
  it("should return the start date when endDate is absent", () => {
    expect(includedDates("2026-08-13", null)).toEqual(["2026-08-13"]);
  });

  it("should omit a skipped night in the middle of the range", () => {
    expect(includedDates("2026-08-13", "2026-09-03", ["2026-08-20"])).toEqual([
      "2026-08-13",
      "2026-08-27",
      "2026-09-03",
    ]);
  });
});

describe("nextIncludedDate", () => {
  it("should skip a past night when a later one remains", () => {
    expect(nextIncludedDate("2026-08-13", "2026-09-03", [], "2026-08-21")).toBe("2026-08-27");
  });

  it("should return null when every included night is in the past", () => {
    expect(nextIncludedDate("2026-08-13", "2026-08-20", [], "2026-08-21")).toBeNull();
  });
});

describe("occurrencesInMonth", () => {
  it("should return three dates when three included nights fall in that month", () => {
    expect(
      occurrencesInMonth("2026-08-13", "2026-08-27", [], { year: 2026, month: 8 }),
    ).toEqual(["2026-08-13", "2026-08-20", "2026-08-27"]);
  });

  it("should return only the days in the viewed month when the series crosses a boundary", () => {
    expect(
      occurrencesInMonth("2026-10-29", "2026-11-12", [], { year: 2026, month: 11 }),
    ).toEqual(["2026-11-05", "2026-11-12"]);
  });
});

describe("seriesOverlapsRange", () => {
  it("should overlap the second month when the series starts in the first and ends in the second", () => {
    expect(
      seriesOverlapsRange("2026-10-29", "2026-11-12", "2026-11-01", "2026-12-01"),
    ).toBe(true);
  });

  it("should not overlap a month entirely before the series", () => {
    expect(
      seriesOverlapsRange("2026-10-29", "2026-11-12", "2026-08-01", "2026-09-01"),
    ).toBe(false);
  });
});

describe("sanitizeSkippedDates", () => {
  it("should drop a skip that falls outside the new range", () => {
    expect(sanitizeSkippedDates("2026-08-13", "2026-08-20", ["2026-08-27"])).toEqual([]);
  });

  it("should keep a skip that is still on the start weekday inside the range", () => {
    expect(sanitizeSkippedDates("2026-08-13", "2026-09-03", ["2026-08-20"])).toEqual([
      "2026-08-20",
    ]);
  });
});
