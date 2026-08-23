import { describe, expect, it } from "vitest";
import {
  buildMonthCells,
  currentMonth,
  formatMonthParam,
  monthRange,
  parseDateOnly,
  parseMonthParam,
  shiftMonth,
  todayISO,
  toISODate,
  weekdayAnchors,
} from "@lib/date/month";

describe("buildMonthCells", () => {
  it("should start the week on Monday when the month opens mid-week", () => {
    // 1 August 2026 is a Saturday.
    const cells = buildMonthCells({ year: 2026, month: 8 }, "2026-08-23");

    expect(cells[0].iso).toBe("2026-07-27");
    expect(cells[5].iso).toBe("2026-08-01");
    expect(cells[5].outside).toBe(false);
  });

  it("should open with the first when the month already starts on a Monday", () => {
    // 1 June 2026 is a Monday.
    const cells = buildMonthCells({ year: 2026, month: 6 }, "2026-08-23");

    expect(cells[0].iso).toBe("2026-06-01");
    expect(cells[0].outside).toBe(false);
  });

  it("should return whole weeks when given any month", () => {
    for (let month = 1; month <= 12; month += 1) {
      const cells = buildMonthCells({ year: 2026, month }, "2026-08-23");

      expect(cells.length % 7).toBe(0);
    }
  });

  it("should mark leading and trailing days as outside", () => {
    const cells = buildMonthCells({ year: 2026, month: 8 }, "2026-08-23");
    const inside = cells.filter((cell) => !cell.outside);

    expect(inside).toHaveLength(31);
    expect(inside[0].iso).toBe("2026-08-01");
    expect(inside[30].iso).toBe("2026-08-31");
    expect(cells[cells.length - 1].outside).toBe(true);
  });

  it("should keep consecutive days across the spring DST change", () => {
    // Copenhagen springs forward on 29 March 2026.
    const cells = buildMonthCells({ year: 2026, month: 3 }, "2026-03-01");
    const march = cells.filter((cell) => !cell.outside).map((cell) => cell.iso);

    expect(march).toHaveLength(31);
    expect(march[27]).toBe("2026-03-28");
    expect(march[28]).toBe("2026-03-29");
    expect(march[29]).toBe("2026-03-30");
  });

  it("should keep consecutive days across the autumn DST change", () => {
    // Copenhagen falls back on 25 October 2026.
    const cells = buildMonthCells({ year: 2026, month: 10 }, "2026-10-01");
    const october = cells.filter((cell) => !cell.outside).map((cell) => cell.iso);

    expect(october).toHaveLength(31);
    expect(october[23]).toBe("2026-10-24");
    expect(october[24]).toBe("2026-10-25");
    expect(october[25]).toBe("2026-10-26");
  });

  it("should include 29 February when the year is a leap year", () => {
    const cells = buildMonthCells({ year: 2028, month: 2 }, "2028-02-01");
    const days = cells.filter((cell) => !cell.outside);

    expect(days).toHaveLength(29);
    expect(days[28].iso).toBe("2028-02-29");
  });

  it("should flag exactly one cell as today when today falls in the month", () => {
    const cells = buildMonthCells({ year: 2026, month: 8 }, "2026-08-23");

    expect(cells.filter((cell) => cell.isToday)).toHaveLength(1);
    expect(cells.find((cell) => cell.isToday)?.iso).toBe("2026-08-23");
  });

  it("should flag no cell as today when today falls outside the month", () => {
    const cells = buildMonthCells({ year: 2026, month: 4 }, "2026-08-23");

    expect(cells.some((cell) => cell.isToday)).toBe(false);
  });
});

describe("parseMonthParam", () => {
  const now = new Date("2026-08-23T10:00:00Z");

  it("should read a well-formed param when given YYYY-MM", () => {
    expect(parseMonthParam("2026-11", now)).toEqual({ year: 2026, month: 11 });
  });

  it("should fall back to the current month when the param is missing", () => {
    expect(parseMonthParam(undefined, now)).toEqual({ year: 2026, month: 8 });
  });

  it("should fall back to the current month when the param is malformed", () => {
    for (const param of ["2026", "2026-1", "august", "2026-13", "0000-05", ""]) {
      expect(parseMonthParam(param, now)).toEqual({ year: 2026, month: 8 });
    }
  });
});

describe("shiftMonth", () => {
  it("should roll into the next year when stepping past December", () => {
    expect(shiftMonth({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
  });

  it("should roll into the previous year when stepping back past January", () => {
    expect(shiftMonth({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
  });

  it("should stay in the same year when the step does not cross a boundary", () => {
    expect(shiftMonth({ year: 2026, month: 8 }, -2)).toEqual({ year: 2026, month: 6 });
  });
});

describe("monthRange", () => {
  it("should return half-open UTC bounds when given a month", () => {
    const { from, to } = monthRange({ year: 2026, month: 8 });

    expect(from.toISOString()).toBe("2026-08-01T00:00:00.000Z");
    expect(to.toISOString()).toBe("2026-09-01T00:00:00.000Z");
  });

  it("should cross the year boundary when given December", () => {
    const { to } = monthRange({ year: 2026, month: 12 });

    expect(to.toISOString()).toBe("2027-01-01T00:00:00.000Z");
  });
});

describe("date-only helpers", () => {
  it("should keep the calendar day when rendered in Copenhagen", () => {
    const rendered = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Copenhagen",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(parseDateOnly("2026-08-13"));

    expect(rendered).toBe("13/08/2026");
  });

  it("should round-trip an ISO date through parse and format", () => {
    expect(toISODate(parseDateOnly("2026-01-01"))).toBe("2026-01-01");
    expect(toISODate(parseDateOnly("2026-12-31"))).toBe("2026-12-31");
  });

  it("should pad the month when formatting a param", () => {
    expect(formatMonthParam({ year: 2026, month: 3 })).toBe("2026-03");
  });

  it("should report the club's calendar day when the server is a day behind", () => {
    // 23:30 UTC is already the 24th in Copenhagen.
    expect(todayISO(new Date("2026-08-23T23:30:00Z"))).toBe("2026-08-24");
  });

  it("should agree with todayISO when reporting the current month", () => {
    const now = new Date("2026-08-23T23:30:00Z");

    expect(currentMonth(now)).toEqual({ year: 2026, month: 8 });
  });
});

describe("weekdayAnchors", () => {
  it("should return seven days starting on Monday", () => {
    const anchors = weekdayAnchors();
    const weekdays = anchors.map((date) =>
      new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short" }).format(date),
    );

    expect(weekdays).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  });
});
