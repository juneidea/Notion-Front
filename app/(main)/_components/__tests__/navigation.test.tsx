import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as documentsQuery from "@/hooks/use-documents-query";
import * as documentsMutate from "@/hooks/use-documents-mutate";
import * as searchQuery from "@/hooks/use-search-query";
import * as trashQuery from "@/hooks/use-trash-query";
import * as trashMutate from "@/hooks/use-trash-mutate";
import * as navigate from "next/navigation";
import { Navigation } from "../navigation";

jest.mock("../../../../hooks/use-documents-mutate", () => {
  return {
    __esModule: true,
    useDocumentsMutate: () => {},
    useQueryClient: () => {},
  };
});

jest.mock("../../../../hooks/use-documents-query", () => {
  return {
    __esModule: true,
    useDocumentsQuery: () => {},
    useQueryClient: () => {},
  };
});

jest.mock("../../../../hooks/use-search-query", () => {
  return {
    __esModule: true,
    useSearchQuery: () => ({}),
  };
});

jest.mock("../../../../hooks/use-trash-query", () => {
  return {
    __esModule: true,
    useTrashQuery: () => ({}),
  };
});

jest.mock("../../../../hooks/use-trash-mutate", () => {
  return {
    __esModule: true,
    useTrashMutate: () => {},
    useQueryClient: () => {},
  };
});

jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    useParams: () => ({ documentId: 1 }),
    usePathname: () => {},
    useRouter: () => {},
  };
});

jest.mock("usehooks-ts", () => {
  return {
    __esModule: true,
    useMediaQuery: () => {},
  };
});

describe("Navigation", () => {
  beforeEach(() => {
    jest
      .spyOn(documentsQuery, "useDocumentsQuery")
      // @ts-ignore
      .mockReturnValue({ isLoading: false });

    jest
      .spyOn(searchQuery, "useSearchQuery")
      // @ts-ignore
      .mockReturnValue({ documents: { data: [{ id: 1 }] } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display chevrons and collapse sidebar width on clicked", async () => {
    jest.spyOn(documentsMutate, "useDocumentsMutate").mockReturnValue({
      archive: jest.fn(),
      onCreate: jest.fn(),
      update: jest.fn(),
    });
    render(
      <Navigation setIsSearchOpen={() => {}} setIsSettingsOpen={() => {}} />
    );
    const aside = screen.getByTestId("aside");
    expect(aside.style.getPropertyValue("width")).toBe("240px");
    const chevronsLeft = screen.getByTestId("chevrons left");
    await userEvent.click(chevronsLeft);
    expect(aside.style.getPropertyValue("width")).toBe("0px");
  });

  it("should render user-item", () => {
    render(
      <Navigation setIsSearchOpen={() => {}} setIsSettingsOpen={() => {}} />
    );
    const userItem = screen.getByTestId("user-item trigger");
    expect(userItem).toBeDefined();
  });

  it("should render search item and call setIsSearchOpen when clicked", async () => {
    const searchOpenSpy = jest.fn();
    render(
      <Navigation
        setIsSearchOpen={searchOpenSpy}
        setIsSettingsOpen={() => {}}
      />
    );
    const items = screen.getAllByTestId("item");
    const searchItem = items[0];
    await userEvent.click(searchItem);
    expect(searchItem.innerHTML).toContain("Search");
    expect(searchOpenSpy).toHaveBeenCalled();
  });

  it("should render settings item and call setIsSettingsOpen when clicked", async () => {
    const settingsOpenSpy = jest.fn();
    render(
      <Navigation
        setIsSearchOpen={() => {}}
        setIsSettingsOpen={settingsOpenSpy}
      />
    );
    const items = screen.getAllByTestId("item");
    const settingsItem = items[1];
    await userEvent.click(settingsItem);
    expect(settingsItem.innerHTML).toContain("Settings");
    expect(settingsOpenSpy).toHaveBeenCalled();
  });

  it("should render new page item and call onCreate when clicked", async () => {
    const onCreateSpy = jest.fn();
    jest.spyOn(documentsMutate, "useDocumentsMutate").mockReturnValue({
      archive: jest.fn(),
      onCreate: onCreateSpy,
      update: jest.fn(),
    });

    render(
      <Navigation setIsSearchOpen={() => {}} setIsSettingsOpen={() => {}} />
    );
    const items = screen.getAllByTestId("item");
    const newpageItem = items[2];
    await userEvent.click(newpageItem);
    expect(newpageItem.innerHTML).toContain("New page");
    expect(onCreateSpy).toHaveBeenCalledWith({ title: "Untitled" });
  });

  it("should render add a page item and call onCreate when clicked", async () => {
    const onCreateSpy = jest.fn();
    jest.spyOn(documentsMutate, "useDocumentsMutate").mockReturnValue({
      archive: jest.fn(),
      onCreate: onCreateSpy,
      update: jest.fn(),
    });

    render(
      <Navigation setIsSearchOpen={() => {}} setIsSettingsOpen={() => {}} />
    );
    const items = screen.getAllByTestId("item");
    const addpageItem = items[3];
    await userEvent.click(addpageItem);
    expect(addpageItem.innerHTML).toContain("Add a page");
    expect(onCreateSpy).toHaveBeenCalledWith({ title: "Untitled" });
  });

  it("should render document-list", () => {
    render(
      <Navigation setIsSearchOpen={() => {}} setIsSettingsOpen={() => {}} />
    );
    const documentList = screen.getByTestId("document list");
    expect(documentList).toBeDefined();
  });

  it("should render trash-box", async () => {
    jest
      .spyOn(trashQuery, "useTrashQuery")
      // @ts-ignore
      .mockReturnValue({ documents: { data: [] } });
    jest
      .spyOn(trashMutate, "useTrashMutate")
      // @ts-ignore
      .mockReturnValue({ remove: jest.fn(), restore: jest.fn() });

    render(
      <Navigation setIsSearchOpen={() => {}} setIsSettingsOpen={() => {}} />
    );
    const trigger = screen.getByTestId("trash box trigger");
    await userEvent.click(trigger);
    expect(trigger).toBeDefined();
  });

  it("should render width line and reset the width when clicked", async () => {
    render(
      <Navigation setIsSearchOpen={() => {}} setIsSettingsOpen={() => {}} />
    );
    const widthLine = screen.getByTestId("width line");
    const aside = screen.getByTestId("aside");
    aside.style.setProperty("width", "300px");
    const navbar = screen.getByTestId("navbar wrapper");
    navbar.style.setProperty("left", "300px");
    await userEvent.click(widthLine);
    expect(aside.style.getPropertyValue("width")).toBe("240px");
    expect(navbar.style.getPropertyValue("left")).toBe("240px");
  });

  it("should render navbar when have documentId param", () => {
    render(
      <Navigation setIsSearchOpen={() => {}} setIsSettingsOpen={() => {}} />
    );
    const navbar = screen.getByTestId("navbar");
    expect(navbar).toBeDefined();
  });

  it("should render empty navbar when no documentId param", () => {
    jest
      .spyOn(navigate, "useParams")
      // @ts-ignore
      .mockReturnValue({});

    render(
      <Navigation setIsSearchOpen={() => {}} setIsSettingsOpen={() => {}} />
    );
    const navbar = screen.getByTestId("empty nav");
    expect(navbar).toBeDefined();
  });
});
