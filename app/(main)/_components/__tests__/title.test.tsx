import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as documentsMutate from "@/hooks/use-documents-mutate";
import { Title } from "../title";

jest.mock("../../../../hooks/use-documents-mutate", () => {
  return {
    __esModule: true,
    useDocumentsMutate: () => ({
      archive: jest.fn(),
      onCreate: jest.fn(),
      update: jest.fn(),
    }),
  };
});

describe("Title", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render icon when icon is provided", () => {
    render(<Title initialData={{ id: 1, title: "", icon: "😊" }} />);
    const icon = screen.getByTestId("icon");
    expect(icon.innerHTML).toBe("😊");
  });

  it("should render button with title", () => {
    render(<Title initialData={{ id: 1, title: "test title" }} />);
    const button = screen.getByTestId("button");
    expect(button.innerHTML).toContain("test title");
  });

  it("should change button to input after clicked", async () => {
    render(<Title initialData={{ id: 1, title: "" }} />);
    const button = screen.getByTestId("button");
    await userEvent.click(button);
    const input = screen.getByTestId("input");
    expect(input).toBeDefined();
  });

  it("should call update when input changed", async () => {
    const updateSpy = jest.fn();
    jest.spyOn(documentsMutate, "useDocumentsMutate").mockReturnValue({
      archive: jest.fn(),
      onCreate: jest.fn(),
      update: updateSpy,
    });

    render(<Title initialData={{ id: 1, title: "" }} />);
    const button = screen.getByTestId("button");
    await userEvent.click(button);
    const input = screen.getByTestId("input");
    await userEvent.type(input, "typing input");
    expect(updateSpy).toHaveBeenNthCalledWith(12, {
      id: 1,
      title: "typing input",
    });
  });

  it("should back to button on enter", async () => {
    render(<Title initialData={{ id: 1, title: "" }} />);
    const button = screen.getByTestId("button");
    await userEvent.click(button);
    const input = screen.getByTestId("input");
    expect(input).toBeDefined();
    await userEvent.keyboard("enter");
    expect(button).toBeDefined();
  });
});
