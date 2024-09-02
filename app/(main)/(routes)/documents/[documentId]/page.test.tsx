import { render, screen } from "@testing-library/react";
import * as documentsMutate from "@/hooks/use-documents-mutate";
import * as searchQuery from "@/hooks/use-search-query";
import DocumentIdPage from "./page";

jest.mock("../../../../../hooks/use-documents-mutate", () => {
  return {
    __esModule: true,
    useDocumentsMutate: () => ({
      archive: jest.fn(),
      onCreate: jest.fn(),
      update: jest.fn(),
    }),
  };
});

jest.mock("../../../../../hooks/use-search-query", () => {
  return {
    __esModule: true,
    useSearchQuery: () => ({}),
  };
});

describe("DocumentIdPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render skeleton when no data", async () => {
    jest
      .spyOn(searchQuery, "useSearchQuery")
      // @ts-ignore
      .mockReturnValue({ documents: {} });

    render(<DocumentIdPage params={{ documentId: "1" }} />);
    const skeleton = screen.getByTestId("skeletons");
    expect(skeleton).toBeDefined();
  });
});
