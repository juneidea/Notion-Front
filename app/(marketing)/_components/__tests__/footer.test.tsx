import { render, screen } from "@testing-library/react";
import { Footer } from "../footer";

describe("Footer", () => {
  it("should render Logo", () => {
    render(<Footer />);
    const logo = screen.getByTestId("logo");
    expect(logo).toBeDefined();
  });

  it("should render correct buttons", () => {
    render(<Footer />);
    const footerButtons = screen.getAllByRole("button") as HTMLButtonElement[];
    expect(footerButtons[0].innerHTML).toContain("Privacy Policy");
    expect(footerButtons[1].innerHTML).toContain("Terms &amp; Conditions");
  });
});
