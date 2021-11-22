import PostDashboard from "../containers/PostDashboard";
import { act } from "react-dom/test-utils";
import { render, screen, cleanup } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";

let container: HTMLElement | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    render(<PostDashboard />);
  });
});

afterEach(() => {
  if (container != null) {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  }
  cleanup();
});

describe("Test interaction with dashboard", () => {
  it("Account Menu properly opens", () => {
    const menuBtn = screen.getByTestId("test-acc-menu-icon");
    expect(screen.queryByTestId("test-post-settings-menu")).toBeNull();
    expect(menuBtn).toBeInTheDocument();

    const menuItems = ["My Posts", "Settings", "Logout"];
    // Initially menu items should not show up
    for (let i = 0; i < menuItems.length; i++) {
      expect(screen.queryByText(menuItems[i])).not.toBeInTheDocument();
    }

    // menu open
    menuBtn.click();
    for (let i = 0; i < menuItems.length; i++) {
      expect(screen.getByText(menuItems[i])).toBeInTheDocument();
    }
  });

  it("Read more button opens up a post", () => {
    /* TODO: This test will change once we integrate with API. Will make a dummy post and check
     that data is displayed correctly */
    expect(screen.queryByTestId("test-post-dialog")).toBeNull();

    screen.getByTestId("test-btn-preview").click();
    expect(screen.queryByTestId("test-post-dialog")).toBeInTheDocument();

  });
});
