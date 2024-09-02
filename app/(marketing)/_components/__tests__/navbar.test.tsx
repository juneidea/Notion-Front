import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as store from "@/app/store";
import { Navbar } from "../navbar";
import * as auth from "../../../../hooks/use-django-auth";

jest.mock("../../../../app/store", () => ({
  __esModule: true,
  ...jest.requireActual("../../../../app/store"),
}));

jest.mock("../../../../hooks/use-django-auth", () => {
  return {
    __esModule: true,
    useDjangoAuth: () => ({
      auth: jest.fn(),
      oauth: jest.fn(),
    }),
  };
});

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

describe("Navbar", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render logo", () => {
    render(<Navbar />);
    const logo = screen.getByTestId("logo");
    expect(logo).toBeDefined();
  });

  it("should render spinner when loading", () => {
    jest
      .spyOn(store, "useAuthStore")
      .mockReturnValueOnce({ user: { avatar: "" } });
    jest.spyOn(store, "useAuthStore").mockReturnValueOnce(false); // authorize
    jest.spyOn(store, "useAuthStore").mockReturnValueOnce(true); // loading
    render(<Navbar />);
    const Spinner = screen.getByTestId("spinner");
    expect(Spinner).toBeDefined();
  });

  it("should render login/signin when not authenticated", () => {
    jest
      .spyOn(store, "useAuthStore")
      .mockReturnValueOnce({ user: { avatar: "" } });
    jest.spyOn(store, "useAuthStore").mockReturnValueOnce(false); // authorize
    jest.spyOn(store, "useAuthStore").mockReturnValueOnce(false); // loading
    render(<Navbar />);
    const login = screen.getAllByText("Log in");
    const signin = screen.getByText("Get Notion Free");
    expect(login[0]).toBeDefined();
    expect(signin).toBeDefined();
  });

  it("should render enter notion when authenticated", () => {
    jest
      .spyOn(store, "useAuthStore")
      .mockReturnValueOnce({ user: { avatar: "" } });
    jest.spyOn(store, "useAuthStore").mockReturnValueOnce(true); // authorize
    jest.spyOn(store, "useAuthStore").mockReturnValueOnce(false); // loading
    render(<Navbar />);
    const enter = screen.getByText("Enter Notion");
    expect(enter).toBeDefined();
  });

  it("should render mode toggle", () => {
    render(<Navbar />);
    const toggle = screen.getByText("Toggle theme");
    expect(toggle).toBeDefined();
  });

  it("should render login modal", () => {
    render(<Navbar />);
    const loginModal = screen.getByTestId("login modal");
    expect(loginModal).toBeDefined();
  });

  it("should render signin modal", () => {
    render(<Navbar />);
    const signinModal = screen.getByTestId("signin modal");
    expect(signinModal).toBeDefined();
  });

  it("should call oauth on mounted when have code", () => {
    const oauthSpy = jest.fn();
    jest
      .spyOn(auth, "useDjangoAuth")
      // @ts-ignore
      .mockReturnValue({ auth: jest.fn(), oauth: oauthSpy() });
    render(<Navbar />);
    expect(oauthSpy).toHaveBeenCalled();
  });

  it("should call auth when login clicked", async () => {
    const authSpy = jest.fn();
    jest
      .spyOn(auth, "useDjangoAuth")
      // @ts-ignore
      .mockReturnValue({ auth: () => authSpy(), oauth: jest.fn() });
    render(<Navbar />);
    const loginButton = screen.getAllByText("Log in");
    await userEvent.click(loginButton[1]);
    expect(authSpy).toHaveBeenCalled();
  });
});
