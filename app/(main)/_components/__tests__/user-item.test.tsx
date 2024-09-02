import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as auth from "@/hooks/use-django-auth";
import * as store from "@/app/store";
import { UserItem } from "../user-item";

jest.mock("../../../../hooks/use-django-auth", () => {
  return {
    __esModule: true,
    useDjangoAuth: () => ({}),
  };
});

jest.mock("../../../../app/store", () => ({
  __esModule: true,
  ...jest.requireActual("../../../../app/store"),
}));

describe("UserItem", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should diplay avatar, username and chaevrons", () => {
    jest.spyOn(store, "useAuthStore").mockReturnValue({
      user: {
        id: 55,
        username: "test",
        email: "test@email",
      },
    });

    render(<UserItem />);
    const avatar = screen.getByTestId("avatar");
    const user = screen.getByTestId("user");
    const chevrons = screen.getByTestId("chevrons");
    expect(avatar).toBeDefined();
    expect(user.innerHTML).toBe("Test's Notion");
    expect(chevrons).toBeDefined();
  });

  it("should diplay email in content", async () => {
    jest.spyOn(store, "useAuthStore").mockReturnValue({
      user: {
        id: 55,
        username: "test",
        email: "test@email",
      },
    });

    render(<UserItem />);
    const trigger = screen.getByTestId("user-item trigger");
    await userEvent.click(trigger);
    const email = screen.getByText("test@email");
    expect(email).toBeDefined();
  });

  it("should call logout when Log out clicked", async () => {
    jest.spyOn(store, "useAuthStore").mockReturnValue({
      user: {
        id: 55,
        username: "test",
        email: "test@email",
      },
    });
    const logoutSpy = jest.fn();
    jest.spyOn(auth, "useDjangoAuth").mockReturnValue({
      auth: jest.fn(),
      oauth: jest.fn(),
      checkToken: jest.fn(),
      logout: logoutSpy,
    });

    render(<UserItem />);
    const trigger = screen.getByTestId("user-item trigger");
    await userEvent.click(trigger);
    const logout = screen.getByText("Log out");
    await userEvent.click(logout);
    expect(logoutSpy).toHaveBeenCalled();
  });
});
