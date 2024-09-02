import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginModal } from "../loginModal";
import * as util from "../util";

jest.mock("../util", () => ({
  __esModule: true,
  ...jest.requireActual("../util"),
}));
const handleAuth = jest.fn();

describe("SigninModal", () => {
  it("should render correct texts", () => {
    render(<LoginModal handleAuth={handleAuth} />);
    const heading = screen.getByText("Sign in");
    const paragraph = screen.getByText("to continue to notion");
    expect(heading).toBeDefined();
    expect(paragraph).toBeDefined();
  });

  it("should render correct labels", () => {
    render(<LoginModal handleAuth={handleAuth} />);
    const heading = screen.getByText("Username");
    const paragraph = screen.getByText("Password");
    expect(heading).toBeDefined();
    expect(paragraph).toBeDefined();
  });

  it("should render correct inputs", () => {
    render(<LoginModal handleAuth={handleAuth} />);
    const inputs = screen.getAllByTestId("input") as HTMLInputElement[];
    expect(inputs[0].getAttribute("name")).toBe("username");
    expect(inputs[0].getAttribute("type")).toBe("text");
    expect(inputs[1].getAttribute("name")).toBe("password");
    expect(inputs[1].getAttribute("type")).toBe("password");
  });

  it("should call handleAuth on button click", async () => {
    render(
      <LoginModal
        handleAuth={(e) => {
          e.preventDefault();
          handleAuth();
        }}
        ref={{ current: "" }}
      />
    );
    const button = screen.getByText("Log in");
    await userEvent.click(button);
    expect(handleAuth).toHaveBeenCalled();
  });

  it("should call handleModalClick on click", async () => {
    const handle = jest.fn();
    jest.spyOn(util, "handleModalClick").mockImplementation(handle);
    render(<LoginModal handleAuth={handleAuth} ref={{ current: "" }} />);
    const dialog = screen.getByTestId("login modal");
    await userEvent.click(dialog);
    expect(handle).toHaveBeenCalled();
  });
});
