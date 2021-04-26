const { unixToSQLDateFormat, combineData } = require("./data-manipulation");

describe("unixToSQLDateFormat", () => {
  it("Should convert unix ts in seconds to date foramt", () => {
    const expected = "2021-04-26 14:55:28";
    const actual = unixToSQLDateFormat(1619448928000);
    expect(actual).toBe(expected);
  });
});
