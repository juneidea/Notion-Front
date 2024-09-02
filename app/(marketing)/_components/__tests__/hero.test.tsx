import { render, screen } from "@testing-library/react";
import { Hero } from "../hero";

describe("Hero", () => {
  it("should render correct images", () => {
    render(<Hero />);
    const logoImages = screen.getAllByRole("img") as HTMLImageElement[];
    expect(logoImages[0].src).toContain("url=%2Fdocuments.png&w=3840&q=75");
    expect(logoImages[1].src).toContain("url=%2Freading.png&w=3840&q=75");
  });
});
