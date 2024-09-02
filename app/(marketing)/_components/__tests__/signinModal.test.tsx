import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SigninModal } from "../signinModal";
import * as util from "../util";

jest.mock("../util", () => ({
  __esModule: true,
  ...jest.requireActual("../util"),
}));

describe("SigninModal", () => {
  it("should render correct text", () => {
    render(<SigninModal />);
    const heading = screen.getByText("Free Sign in");
    const paragraph = screen.getByText("with Github");
    expect(heading).toBeDefined();
    expect(paragraph).toBeDefined();
  });

  it("should render correct image", () => {
    render(<SigninModal />);
    const logoImages = screen.getByTestId("github image") as HTMLImageElement;
    expect(logoImages.src).toContain("/github.svg");
  });

  it("should call handleSignInGithub on button click", async () => {
    const handle = jest.fn();
    jest.spyOn(util, "handleSignInGithub").mockImplementation(handle);
    render(<SigninModal ref={{ current: "" }} />);
    const login = screen.getByText("Log in");
    await userEvent.click(login);
    expect(handle).toHaveBeenCalled();
  });

  it("should call handleModalClick on click", async () => {
    const handle = jest.fn();
    jest.spyOn(util, "handleModalClick").mockImplementation(handle);
    render(<SigninModal ref={{ current: "" }} />);
    const dialog = screen.getByTestId("signin dialog");
    await userEvent.click(dialog);
    expect(handle).toHaveBeenCalled();
  });
});
