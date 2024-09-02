import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as searchQuery from "@/hooks/use-search-query";
import { Navbar } from "../navbar";

jest.mock("../../../../hooks/use-search-query", () => {
  return {
    __esModule: true,
    useSearchQuery: () => ({}),
  };
});

jest.mock("../../../../hooks/use-documents-mutate", () => {
  return {
    __esModule: true,
    useDocumentsMutate: () => ({
      archive: jest.fn(),
      onCreate: jest.fn(),
      update: jest.fn(),
    }),
    useQueryClient: () => {},
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

const onResetWidthSpy = jest.fn();

describe("Navbar", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render skeleton when no documents", () => {
    jest
      .spyOn(searchQuery, "useSearchQuery")
      // @ts-ignore
      .mockReturnValue({ documents: { data: [] } });

    render(<Navbar isCollapsed={false} onResetWidth={onResetWidthSpy} />);
    const titleSkeleton = screen.getByTestId("title skeleton");
    const menuSkeleton = screen.getByTestId("menu skeleton");
    expect(titleSkeleton).toBeDefined();
    expect(menuSkeleton).toBeDefined();
  });

  it("should render menuIcon when collapsed and call onResetWidth on clicked", async () => {
    jest
      .spyOn(searchQuery, "useSearchQuery")
      // @ts-ignore
      .mockReturnValue({ documents: { data: [{ id: 1 }] } });

    render(<Navbar isCollapsed={true} onResetWidth={onResetWidthSpy} />);
    const menuIcon = screen.getByTestId("menu icon");
    await userEvent.click(menuIcon);
    expect(onResetWidthSpy).toHaveBeenCalledTimes(1);
  });

  it("should render title, publish, menu", async () => {
    jest
      .spyOn(searchQuery, "useSearchQuery")
      // @ts-ignore
      .mockReturnValue({ documents: { data: [{ id: 1 }] } });

    render(<Navbar isCollapsed={false} onResetWidth={onResetWidthSpy} />);
    const title = screen.getByTestId("title");
    const publicTrigger = screen.getByTestId("publish trigger");
    const menuTrigger = screen.getByTestId("menu trigger");
    expect(title).toBeDefined();
    expect(publicTrigger).toBeDefined();
    expect(menuTrigger).toBeDefined();
  });

  it("should render banner when document is archived", async () => {
    jest
      .spyOn(searchQuery, "useSearchQuery")
      // @ts-ignore
      .mockReturnValue({ documents: { data: [{ id: 1, is_archived: true }] } });

    render(<Navbar isCollapsed={false} onResetWidth={onResetWidthSpy} />);
    const banner = screen.getByTestId("banner");
    expect(banner).toBeDefined();
  });
});
