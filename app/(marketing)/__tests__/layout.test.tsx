import { render, screen } from "@testing-library/react";
import MarketingLayout from "../layout";

jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
      get: () => "code",
    }),
  };
});

describe("MarketingLayout", () => {
  it("should render navbar", () => {
    render(<MarketingLayout children />);
    const navbar = screen.getByTestId("navbar");
    expect(navbar).toBeDefined();
  });
});
