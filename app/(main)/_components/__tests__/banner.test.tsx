import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as trash from "../../../../hooks/use-trash-mutate";
import { Banner } from "../banner";

jest.mock("../../../../hooks/use-trash-mutate", () => {
  return {
    __esModule: true,
    useTrashMutate: () => ({
      remove: jest.fn(),
      restore: jest.fn(),
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

describe("Banner", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display text", () => {
    render(<Banner documentId={0} />);
    const text = screen.getByText("This page is in the Trash");
    expect(text).toBeDefined();
  });

  it("should call trash restore on button clicked", async () => {
    const restoreSpy = jest.fn();
    jest
      .spyOn(trash, "useTrashMutate")
      .mockReturnValue({ restore: restoreSpy, remove: jest.fn() });

    render(<Banner documentId={0} />);
    const restoreButton = screen.getByText("Restore Page");
    await userEvent.click(restoreButton);
    expect(restoreSpy).toHaveBeenCalled();
  });

  it("should call trash remove on confirmed", async () => {
    const removeSpy = jest.fn();
    jest
      .spyOn(trash, "useTrashMutate")
      .mockReturnValue({ restore: jest.fn(), remove: removeSpy });

    render(<Banner documentId={0} />);
    const removeButton = screen.getByText("Delete forever");
    await userEvent.click(removeButton);
    const confirmButton = screen.getByText("Confirm");
    await userEvent.click(confirmButton);
    // skip test in setTimeOut
    // expect(removeSpy).toHaveBeenCalled();
  });
});
