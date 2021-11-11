import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { render, screen, fireEvent } from "@testing-library/react";

import AuthContainer from "./AuthContainer";

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => jest.fn(),
  useLocation: () =>
    jest.fn().mockReturnValue({ state: { from: { pathname: undefined } } }),
}));

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

describe("test Auth Pages", () => {
  it("should switch pages between Login and Sign up on Tab Response", () => {
    act(() => {
      render(<AuthContainer />);
    });

    // test if auth container has been rendered
    const inputLogin = screen.getByTestId("LogInTab");
    expect(inputLogin).toBeInTheDocument();

    // toggle to sign up
    screen.getByTestId("SignUpTabButton").click();
    const checkSignUp = screen.getByTestId("SignUpTab");
    expect(checkSignUp).toBeInTheDocument();

    // toggle to login
    screen.getByTestId("LogInTabButton").click();
    const checkLogIn = screen.getByTestId("LogInTab");
    expect(checkLogIn).toBeInTheDocument();
  });

  it("should switch pages between Login and Sign up inside form button clicks", () => {
    act(() => {
      render(<AuthContainer />);
    });

    // test if auth container has been rendered
    const inputLogin = screen.getByTestId("LogInTab");
    expect(inputLogin).toBeInTheDocument();

    // toggle to sign up from in-form button
    screen.getByTestId("CreateAccountButton").click();
    const checkSignUp = screen.getByTestId("SignUpTab");
    expect(checkSignUp).toBeInTheDocument();

    // toggle to log in from in-form button
    screen.getByTestId("GoToLogIn").click();
    const checkLogIn = screen.getByTestId("LogInTab");
    expect(checkLogIn).toBeInTheDocument();
  });
});

describe("verifying valid input for signup page", () => {
  it("only allows valid uToronto email addresses", () => {
    act(() => {
      render(<AuthContainer />);
    });
    screen.getByTestId("SignUpTabButton").click();
    const emailForm = screen.getByPlaceholderText("john@mail.utoronto.ca");

    const invalidCases = [
      "firstname@gmail.com",
      "gurvir@utoronto.com",
      "bob@....utoronto.ca",
    ];
    invalidCases.forEach((emailToCheck) => {
      fireEvent.change(emailForm, { target: { value: emailToCheck } });
      fireEvent.blur(emailForm);
      expect(
        screen.getByText("Invalid email, only utoronto emails allowed")
      ).toBeInTheDocument();
    });

    const validCases = [
      "bob.vance@alum.utoronto.ca",
      "andy.c@mail.utoronto.ca",
      "bob@utoronto.ca",
    ];

    validCases.forEach((emailToCheck) => {
      fireEvent.change(emailForm, { target: { value: emailToCheck } });
      fireEvent.blur(emailForm);
      expect(
        screen.queryByText("Invalid email, only utoronto emails allowed")
      ).toBeNull();
    });
  });
});
