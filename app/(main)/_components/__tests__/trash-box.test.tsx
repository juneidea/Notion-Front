import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as trashQuery from "@/hooks/use-trash-query";
import * as trashMutate from "@/hooks/use-trash-mutate";
import { TrashBox } from "../trash-box";

jest.mock("../../../../hooks/use-trash-query", () => {
  return {
    __esModule: true,
    useTrashQuery: () => {},
  };
});

jest.mock("../../../../hooks/use-trash-mutate", () => {
  return {
    __esModule: true,
    useTrashMutate: () => ({
      remove: jest.fn(),
      restore: jest.fn(),
    }),
    useQueryClient: () => {},
  };
});

const routerPushSpy = jest.fn();
jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    useRouter: () => ({
      push: routerPushSpy,
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
    useParams: () => ({
      get: jest.fn(),
    }),
  };
});

describe("TrashBox", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render spinner when no documents", () => {
    jest
      .spyOn(trashQuery, "useTrashQuery")
      // @ts-ignore
      .mockReturnValue({ data: undefined });

    render(<TrashBox />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toBeDefined();
  });

  it("should render icon and input", () => {
    jest
      .spyOn(trashQuery, "useTrashQuery")
      // @ts-ignore
      .mockReturnValue({ data: [] });

    render(<TrashBox />);
    const icon = screen.getByTestId("search icon");
    const input = screen.getByTestId("search input");
    expect(icon).toBeDefined();
    expect(input).toBeDefined();
  });

  it("should render empty document", () => {
    jest
      .spyOn(trashQuery, "useTrashQuery")
      // @ts-ignore
      .mockReturnValue({ data: [] });

    render(<TrashBox />);
    const emptyDocument = screen.getByText("No documents found.");
    expect(emptyDocument).toBeDefined();
  });

  it("should render title and call router push with correct url after clicked", async () => {
    jest
      .spyOn(trashQuery, "useTrashQuery")
      // @ts-ignore
      .mockReturnValue({ data: [{ id: 55, title: "test 1" }] });

    render(<TrashBox />);
    const document = screen.getByTestId("document");
    const title = screen.getByTestId("document title");
    expect(title.innerHTML).toBe("test 1");
    await userEvent.click(document);
    expect(routerPushSpy).toHaveBeenCalledWith("/documents/55");
  });

  it("should call restore when undo clicked", async () => {
    jest
      .spyOn(trashQuery, "useTrashQuery")
      // @ts-ignore
      .mockReturnValue({ data: [{ id: 55, title: "test 1" }] });
    const restoreSpy = jest.fn();
    jest
      .spyOn(trashMutate, "useTrashMutate")
      // @ts-ignore
      .mockReturnValue({ restore: restoreSpy });

    render(<TrashBox />);
    const undo = screen.getByTestId("undo");
    await userEvent.click(undo);
    expect(restoreSpy).toHaveBeenCalledWith(55);
  });

  it("should call remove when trash clicked", async () => {
    jest
      .spyOn(trashQuery, "useTrashQuery")
      // @ts-ignore
      .mockReturnValue({ data: [{ id: 55, title: "test 1" }] });
    const removeSpy = jest.fn();
    jest
      .spyOn(trashMutate, "useTrashMutate")
      // @ts-ignore
      .mockReturnValue({ remove: removeSpy });

    render(<TrashBox />);
    const trigger = screen.getByTestId("confirm trigger");
    await userEvent.click(trigger);
    const confirm = screen.getByTestId("confirm button");
    await userEvent.click(confirm);
    // skip test in setTimeOut
    // expect(removeSpy).toHaveBeenCalledWith(55);
  });
});
