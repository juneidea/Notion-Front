import { render, screen } from "@testing-library/react";
import { Logo } from "../logo";

describe("Logo", () => {
  it("should render correct images", () => {
    render(<Logo />);
    const logoImages = screen.getAllByRole("img") as HTMLImageElement[];
    expect(logoImages[0].src).toContain("url=%2Flogo.png&w=96&q=75");
    expect(logoImages[1].src).toContain("url=%2Flogo-dark.png&w=96&q=75");
  });

  it("should render correct text", () => {
    render(<Logo />);
    const logoText = screen.getByRole("paragraph");
    expect(logoText.innerHTML).toBe("Notion");
  });
});
