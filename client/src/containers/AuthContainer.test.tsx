import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { AxiosResponse } from "axios";

import AuthContainer from "./AuthContainer";
import ServerApi from "../api/v1";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockNavigate,
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
  cleanup();
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

describe("signUp component", () => {
  describe("handleSubmit function", () => {
    it("should show password mismatch alert", async () => {
      act(() => {
        render(<AuthContainer />);
      });

      screen.getByTestId("SignUpTabButton").click();

      const fields = [
        ["passwordForm", "password"],
        ["confirmPassForm", "passwordd"],
      ];
      fields.forEach((pair) => {
        fireEvent.change(
          screen
            .getByTestId(pair[0])
            .querySelector("input") as HTMLInputElement,
          { target: { value: pair[1] } }
        );
      });

      const form = screen.getByTestId("form");
      const mockAlert = jest
        .spyOn(window, "alert")
        .mockImplementation(() => {});

      fireEvent.submit(form);
      expect(mockAlert).toBeCalledWith("Passwords do not match.");
    });

    it("should show backend error alert on backend error", async () => {
      act(() => {
        render(<AuthContainer />);
      });

      screen.getByTestId("SignUpTabButton").click();

      const form = screen.getByTestId("form");
      const msg = "test";
      const mockSignUp = jest
        .spyOn(ServerApi.prototype, "signUp")
        .mockImplementation(() =>
          Promise.resolve({ error: { response: { data: { message: msg } } } })
        );
      const mockAlert = jest
        .spyOn(window, "alert")
        .mockImplementation(() => {});

      fireEvent.submit(form);
      /**
       * Since fireEvent.submit is not async function we cannot use await
       * Without an await, expect(mockAlert) assertion can run before
       * fireEvent.submit can complete execution causing the test to fail.
       * Therefore, we await on dummy Promise to delay execution while
       * fireEvent.submit completes.
       */
      await new Promise((r) => setTimeout(r, 1));
      expect(mockSignUp).toBeCalled();
      expect(mockAlert).toBeCalledWith(`Message: ${msg}`);
    });

    it("should show email confirmation alert on success", async () => {
      act(() => {
        render(<AuthContainer />);
      });

      screen.getByTestId("SignUpTabButton").click();

      const form = screen.getByTestId("form");
      const mockSignUp = jest
        .spyOn(ServerApi.prototype, "signUp")
        .mockImplementation(() =>
          Promise.resolve({ response: {} as AxiosResponse })
        );
      const mockAlert = jest
        .spyOn(window, "alert")
        .mockImplementation(() => {});

      fireEvent.submit(form);
      await new Promise((r) => setTimeout(r, 1));
      expect(mockSignUp).toBeCalled();
      expect(mockAlert).toBeCalledWith("Email confirmation sent!");
    });
  });
});

describe("Login component", () => {
  describe("handleSubmit function", () => {
    it("should show backend error alert on backend error", async () => {
      act(() => {
        render(<AuthContainer />);
      });

      screen.getByTestId("LogInTabButton").click();

      const form = screen.getByTestId("form");
      const msg = "test";
      const mockSignIn = jest
        .spyOn(ServerApi.prototype, "signIn")
        .mockImplementation(() =>
          Promise.resolve({ error: { response: { data: { message: msg } } } })
        );
      const mockAlert = jest
        .spyOn(window, "alert")
        .mockImplementation(() => {});

      fireEvent.submit(form);
      await new Promise((r) => setTimeout(r, 1));
      expect(mockSignIn).toBeCalled();
      expect(mockAlert).toBeCalledWith(`Message: ${msg}`);
    });

    it("should navigate to dashboard on success", async () => {
      act(() => {
        render(<AuthContainer />);
      });

      screen.getByTestId("LogInTabButton").click();

      const form = screen.getByTestId("form");
      const mockSignIn = jest
        .spyOn(ServerApi.prototype, "signIn")
        .mockImplementation(() =>
          Promise.resolve({ response: {} as AxiosResponse })
        );

      fireEvent.submit(form);
      await new Promise((r) => setTimeout(r, 1));
      expect(mockSignIn).toBeCalled();
      expect(mockNavigate).toBeCalled();
    });
  });
});
