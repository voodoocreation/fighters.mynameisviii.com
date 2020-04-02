import { failure, success } from "./root.models";

describe("[models] Response", () => {
  it("creates a valid failure object", () => {
    expect(failure("Error")).toEqual({
      message: "Error",
      ok: false,
    });
  });

  it("creates a valid success object", () => {
    const data = {
      test: "Success",
    };

    expect(success(data)).toEqual({
      data,
      ok: true,
    });
  });
});
