import { render, screen } from "@testing-library/react";
import * as store from "@/app/store";
import { Heading } from "../heading";

jest.mock("../../../../app/store", () => ({
  __esModule: true,
  ...jest.requireActual("../../../../app/store"),
}));

describe("Heading", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render correct headings text", () => {
    render(<Heading />);
    const headings = screen.getAllByRole("heading");
    expect(headings[0].innerHTML).toContain(
      "Your Ideas, Documents, &amp; Plans. Unified. Welcome to"
    );
    expect(headings[1].innerHTML).toContain(
      "Notion is the connected workspace where"
    );
  });

  it("should render enter spinner when loading", () => {
    jest.spyOn(store, "useAuthStore").mockReturnValue(true); // loading
    render(<Heading />);
    const Spinner = screen.getByTestId("spinner");
    expect(Spinner).toBeDefined();
  });

  it("should render signin trigger when unauthorized", () => {
    jest.spyOn(store, "useAuthStore").mockReturnValueOnce(false); // authorized
    jest.spyOn(store, "useAuthStore").mockReturnValueOnce(false); // loading
    render(<Heading />);
    const signinTrigger = screen.getByTestId("signin trigger");
    expect(signinTrigger).toBeDefined();
  });

  it("should render enter button when authorized", () => {
    jest.spyOn(store, "useAuthStore").mockReturnValueOnce(true); // authorized
    jest.spyOn(store, "useAuthStore").mockReturnValueOnce(false); // loading
    render(<Heading />);
    const enterButtons = screen.getByTestId("enter notion");
    expect(enterButtons).toBeDefined();
  });

  it("should render signin modal", () => {
    render(<Heading />);
    const signinModal = screen.getByTestId("signin modal");
    expect(signinModal).toBeDefined();
  });
});
