import PostDashboard from "../containers/PostDashboard";
import { act } from "react-dom/test-utils";
import { render, screen, cleanup } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";

let container: HTMLElement | null = null;

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockNavigate,
}));

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

describe("Posts properly show up", () => {
  it("Post properly fetched from API", () =>  {
    // TODO

  })

})

describe("Test interaction with dashboard", () => {
  it("Account Menu properly opens", () => {
    const menuBtn = screen.getByTestId("test-acc-menu-icon");
    expect(screen.queryByTestId("test-post-settings-menu")).toBeNull();
    expect(menuBtn).toBeInTheDocument();

    const menuItems = ["My Posts", "Logout"];
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


});
