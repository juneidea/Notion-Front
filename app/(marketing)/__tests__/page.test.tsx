import { render, screen } from "@testing-library/react";
import MarketingPage from "../page";

describe("MarketingPage", () => {
  it("should render heading", () => {
    render(<MarketingPage />);
    const navbar = screen.getByTestId("heading");
    expect(navbar).toBeDefined();
  });

  it("should render hero", () => {
    render(<MarketingPage />);
    const navbar = screen.getByTestId("hero");
    expect(navbar).toBeDefined();
  });

  it("should render footer", () => {
    render(<MarketingPage />);
    const navbar = screen.getByTestId("footer");
    expect(navbar).toBeDefined();
  });
});
