import { render, screen } from "@testing-library/react";
import * as navigate from "next/navigation";
import * as store from "../store";
import MainLayout from "./layout";

jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    redirect: () => {},
    useParams: () => ({ documentId: 1 }),
    usePathname: () => {},
    useRouter: () => {},
  };
});

jest.mock("../store", () => ({
  __esModule: true,
  ...jest.requireActual("../store"),
}));

describe("MainLayout", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render spinner when loading", () => {
    jest.spyOn(store, "useAuthStore").mockReturnValue(true); // loading
    render(<MainLayout children />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toBeDefined();
  });

  it("should call redirect when not authenticated", () => {
    jest.spyOn(store, "useAuthStore").mockReturnValueOnce(false); // authorized
    jest.spyOn(store, "useAuthStore").mockReturnValueOnce(false); // loading
    const redirectSpy = jest.fn();
    // @ts-ignore
    jest.spyOn(navigate, "redirect").mockImplementation(() => {
      redirectSpy();
    });
    render(<MainLayout children />);
    expect(redirectSpy).toHaveBeenCalledTimes(1);
  });
});
