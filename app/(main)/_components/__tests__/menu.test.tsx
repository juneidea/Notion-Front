import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as documentsMutate from "@/hooks/use-documents-mutate";
import * as store from "@/app/store";
import { Menu } from "../menu";

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

jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
    useParams: () => ({
      get: jest.fn(),
    }),
  };
});

describe("Menu", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should open dropdown when trigger clicked and call archive when confirmed", async () => {
    const archiveSpy = jest.fn();
    jest.spyOn(documentsMutate, "useDocumentsMutate").mockReturnValue({
      archive: archiveSpy,
      onCreate: jest.fn(),
      update: jest.fn(),
    });

    render(<Menu documentId={1} />);
    const trigger = screen.getByTestId("menu trigger");
    await userEvent.click(trigger);
    const confirm = screen.getByText("Delete");
    await userEvent.click(confirm);
    expect(archiveSpy).toHaveBeenCalled();
  });

  it("should render username in dropdown", async () => {
    jest
      .spyOn(store, "useAuthStore")
      .mockReturnValue({ user: { username: "test username" } });

    render(<Menu documentId={1} />);
    const trigger = screen.getByTestId("menu trigger");
    await userEvent.click(trigger);
    const editor = screen.getByText("Last edited by: test username");
    expect(editor).toBeDefined();
  });
});
