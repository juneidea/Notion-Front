import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as documentsMutate from "@/hooks/use-documents-mutate";
import { Publish } from "../publish";

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

describe("Publish", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should open dropdown when trigger clicked and render header", async () => {
    render(<Publish initialData={{ id: 1, title: "", is_published: true }} />);
    const trigger = screen.getByTestId("publish trigger");
    await userEvent.click(trigger);
    const header = screen.getByText("This note is live on web.");
    expect(header).toBeDefined();
  });

  it("should call writeText when copy clicked", async () => {
    const writeTextSpy = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy,
      },
    });

    render(<Publish initialData={{ id: 1, title: "", is_published: true }} />);
    const trigger = screen.getByTestId("publish trigger");
    await userEvent.click(trigger);
    const copy = screen.getByTestId("copy");
    await userEvent.click(copy);
    expect(writeTextSpy).toHaveBeenCalled();
  });

  it("should call update when unpublish clicked", async () => {
    const updateSpy = jest.fn();
    jest.spyOn(documentsMutate, "useDocumentsMutate").mockReturnValue({
      archive: jest.fn(),
      onCreate: jest.fn(),
      update: updateSpy,
    });

    render(<Publish initialData={{ id: 1, title: "", is_published: true }} />);
    const trigger = screen.getByTestId("publish trigger");
    await userEvent.click(trigger);
    const unpublish = screen.getByText("Unpublish");
    await userEvent.click(unpublish);
    expect(updateSpy).toHaveBeenNthCalledWith(1, {
      id: 1,
      is_published: false,
    });
  });

  it("should render correct header for is_published false", async () => {
    render(<Publish initialData={{ id: 1, title: "", is_published: false }} />);
    const trigger = screen.getByTestId("publish trigger");
    await userEvent.click(trigger);
    const header = screen.getByText("Publish this note");
    const share = screen.getByText("Share your work with others.");
    expect(header).toBeDefined();
    expect(share).toBeDefined();
  });

  it("should call update when publish clicked", async () => {
    const updateSpy = jest.fn();
    jest.spyOn(documentsMutate, "useDocumentsMutate").mockReturnValue({
      archive: jest.fn(),
      onCreate: jest.fn(),
      update: updateSpy,
    });

    render(<Publish initialData={{ id: 1, title: "", is_published: false }} />);
    const trigger = screen.getByTestId("publish trigger");
    await userEvent.click(trigger);
    const publish = screen.getByTestId("confirm publish");
    await userEvent.click(publish);
    expect(updateSpy).toHaveBeenNthCalledWith(1, {
      id: 1,
      is_published: true,
    });
  });
});
