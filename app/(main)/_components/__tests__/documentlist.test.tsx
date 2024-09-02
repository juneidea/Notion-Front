import { render, screen } from "@testing-library/react";
import * as documents from "../../../../hooks/use-documents-query";
import { DocumentList } from "../document-list";

jest.mock("../../../../hooks/use-documents-query", () => {
  return {
    __esModule: true,
    useDocumentsQuery: () => [{}],
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

describe("DocumentList", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display skeleton when loading", () => {
    jest
      .spyOn(documents, "useDocumentsQuery")
      // @ts-ignore
      .mockReturnValue({ isLoading: true });

    render(<DocumentList />);
    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBe(3);
  });

  it("should render no page", async () => {
    jest
      .spyOn(documents, "useDocumentsQuery")
      // @ts-ignore
      .mockReturnValue({ isLoading: false });

    render(<DocumentList />);
    const noPage = screen.getByText("No pages inside");
    expect(noPage).toBeDefined();
  });

  it("should render item when have data", async () => {
    jest
      .spyOn(documents, "useDocumentsQuery")
      // @ts-ignore
      .mockReturnValue({
        isLoading: false,
        data: [{ id: 1, title: "test title", icon: "" }],
      });

    render(<DocumentList />);
    const item = screen.getByTestId("item");
    expect(item).toBeDefined();
  });
});
