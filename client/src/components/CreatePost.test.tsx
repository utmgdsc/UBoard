import React from "react";
import CreatePost from "./CreatePost";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { render, screen, fireEvent } from "@testing-library/react";
import newImage from "../assets/background.jpg";

let container: HTMLElement | null = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  if (container != null) {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  }
});

describe("verifying launch of create post component", () => {
  it("should render out the create post form", () => {
    act(() => {
      render(<CreatePost />);
    });
    const bodyTextField = screen.getByTestId("bodyTextField");
    expect(bodyTextField).toBeInTheDocument();
  });

  it("shows the preview button as disabled", () => {
    act(() => {
      render(<CreatePost />);
    });

    // get the preview button
    const previewButton = screen.getByTestId("previewButton");
    expect(previewButton).toBeDisabled();
    // input title
    const titleTextField = screen.getByPlaceholderText("title");
    fireEvent.change(titleTextField, { target: { value: "Test Club" } });
    // input body
    const bodyTextField = screen.getByPlaceholderText("description");
    fireEvent.change(bodyTextField, { target: { value: "body" } });
    fireEvent.blur(bodyTextField);
    expect(previewButton).not.toBeDisabled();
  });
});
