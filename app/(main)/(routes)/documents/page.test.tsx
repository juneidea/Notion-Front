import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as documentsMutate from "@/hooks/use-documents-mutate";
import * as store from "@/app/store";
import DocumentsPage from "./page";

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

jest.mock("../../../../app/store", () => ({
  __esModule: true,
  ...jest.requireActual("../../../../app/store"),
}));

describe("DocumentsPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render username in header", async () => {
    jest
      .spyOn(store, "useAuthStore")
      .mockReturnValue({ user: { username: "test username" } });

    render(<DocumentsPage />);
    const editor = screen.getByText("Welcome to Test username's Notion");
    expect(editor).toBeDefined();
  });

  it("should call onCreate when create child is clicked", async () => {
    const createSpy = jest.fn();
    jest.spyOn(documentsMutate, "useDocumentsMutate").mockReturnValue({
      archive: jest.fn(),
      onCreate: createSpy,
      update: jest.fn(),
    });

    render(<DocumentsPage />);
    const createNote = screen.getByText("Create a note");
    await userEvent.click(createNote);
    expect(createSpy).toHaveBeenCalled();
  });
});
