import React from "react";
// import { render, screen } from "@testing-library/react";
import AuthContainer from "./AuthContainer";
import { unmountComponentAtNode } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
// import fireEvent from "@testing-library/react";
import { render, screen, fireEvent } from "@testing-library/react";

let container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("test Auth Pages", () => {
  it("should switch pages between Login and Sign up on Tab Response", () => {
    act(() => {
      render(<AuthContainer />);
    });

    // test if auth container has been rendered
    const inputLogin = screen.getByText("Login");
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
    const inputLogin = screen.getByText("Login");
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

describe("verifying valid input for login and sigup page", () => {
  it("should check if email field is valid", () => {
    act(() => {
      render(<AuthContainer />);
    });
    screen.getByTestId("SignUpTabButton").click();
    const emailForm = screen.getByPlaceholderText("john@mail.utoronto.ca");
    fireEvent.change(emailForm, { target: { value: "firstname@gmail.com" } });
    fireEvent.blur(emailForm);
    expect(
      screen.getByText("Invalid Email. Only utoronto emails allowed")
    ).toBeInTheDocument();
  });
});
