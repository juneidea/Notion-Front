import { render, screen } from "@testing-library/react";
import { FileIcon } from "lucide-react";
import userEvent from "@testing-library/user-event";
import * as documentsMutate from "@/hooks/use-documents-mutate";
import * as store from "@/app/store";
import { Item } from "../item";

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

describe("Item", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display expandale when id is passed", () => {
    render(<Item label="" icon={FileIcon} id={1} />);
    const expand = screen.getByTestId("expandable");
    expect(expand).toBeDefined();
  });

  it("should call onExpand when expandale is clicked", async () => {
    const onExpandSpy = jest.fn();
    render(<Item label="" icon={FileIcon} id={1} onExpand={onExpandSpy} />);
    const expand = screen.getByTestId("expandable");
    await userEvent.click(expand);
    expect(onExpandSpy).toHaveBeenCalled();
  });

  it("should display default icon when no document's icon", () => {
    render(<Item label="" icon={FileIcon} id={1} />);
    const defaultIcon = screen.getByTestId("default icon");
    expect(defaultIcon).toBeDefined();
  });

  it("should display document's icon when it passed", () => {
    const testIcon = "some icon";
    render(<Item label="" icon={FileIcon} id={1} documentIcon={testIcon} />);
    const documentIcon = screen.getByTestId("document icon");
    expect(documentIcon.innerHTML).toBe(testIcon);
  });

  it("should display label", () => {
    render(<Item label="test label" icon={FileIcon} id={1} />);
    const label = screen.getByTestId("label");
    expect(label.innerHTML).toBe("test label");
  });

  it("should display shortcut when isSearch", () => {
    render(<Item label="" icon={FileIcon} id={1} isSearch={true} />);
    const shortcut = screen.getByText("⌘");
    expect(shortcut).toBeDefined();
  });

  it("should open dropdown when trash clicked and call archive when confirmed", async () => {
    const archiveSpy = jest.fn();
    jest.spyOn(documentsMutate, "useDocumentsMutate").mockReturnValue({
      archive: archiveSpy,
      onCreate: jest.fn(),
      update: jest.fn(),
    });

    render(<Item label="test label" icon={FileIcon} id={1} />);
    const trash = screen.getByTestId("trigger");
    await userEvent.click(trash);
    const confirm = screen.getByText("Delete");
    await userEvent.click(confirm);
    expect(archiveSpy).toHaveBeenCalled();
  });

  it("should render username in dropdown", async () => {
    jest
      .spyOn(store, "useAuthStore")
      .mockReturnValue({ user: { username: "test username" } });

    render(<Item label="test label" icon={FileIcon} id={1} />);
    const trigger = screen.getByTestId("trigger");
    await userEvent.click(trigger);
    const editor = screen.getByText("Last edited by: test username");
    expect(editor).toBeDefined();
  });

  it("should call onCreate when create child is clicked", async () => {
    const createSpy = jest.fn();
    jest.spyOn(documentsMutate, "useDocumentsMutate").mockReturnValue({
      archive: jest.fn(),
      onCreate: createSpy,
      update: jest.fn(),
    });

    render(<Item label="test label" icon={FileIcon} id={1} />);
    const createChild = screen.getByTestId("create child");
    await userEvent.click(createChild);
    expect(createSpy).toHaveBeenCalled();
  });
});
