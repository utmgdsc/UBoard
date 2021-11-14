import React from "react";
import { act } from "react-dom/test-utils";
import { render, screen, fireEvent } from "@testing-library/react";
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

beforeEach(() => {
  render(<AuthContainer />);
});

describe("test Auth Pages", () => {
  it("should switch pages between SignIn and Sign up on Tab Response", () => {
    // test if auth container has been rendered
    const inputSignIn = screen.getByTestId("SignInTab");
    expect(inputSignIn).toBeInTheDocument();

    // toggle to sign up
    screen.getByTestId("SignUpTabButton").click();
    const checkSignUp = screen.getByTestId("SignUpTab");
    expect(checkSignUp).toBeInTheDocument();

    // toggle to signin
    screen.getByTestId("SignInTabButton").click();
    const checkSignIn = screen.getByTestId("SignInTab");
    expect(checkSignIn).toBeInTheDocument();
  });

  it("should switch pages between SignIn and Sign up inside form button clicks", () => {
    // test if auth container has been rendered
    const inputSignIn = screen.getByTestId("SignInTab");
    expect(inputSignIn).toBeInTheDocument();

    // toggle to sign up from in-form button
    screen.getByTestId("CreateAccountButton").click();
    const checkSignUp = screen.getByTestId("SignUpTab");
    expect(checkSignUp).toBeInTheDocument();

    // toggle to log in from in-form button
    screen.getByTestId("GoToSignIn").click();
    const checkSignIn = screen.getByTestId("SignInTab");
    expect(checkSignIn).toBeInTheDocument();
  });
});

describe("verifying valid input for signup page", () => {
  it("only allows valid uToronto email addresses", () => {
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
    describe("On error", () => {
      it("should not call signUp if form is missing fields", async () => {
        screen.getByTestId("SignUpTabButton").click();

        const form = screen.getByTestId("form");
        const mockSignUp = jest
          .spyOn(ServerApi.prototype, "signUp")
          .mockImplementation();

        fireEvent.submit(form);
        expect(mockSignUp).not.toBeCalled();
      });

      it("should not call signUp if errors are present", async () => {
        screen.getByTestId("SignUpTabButton").click();

        const form = screen.getByTestId("form");
        const mockSignUp = jest
          .spyOn(ServerApi.prototype, "signUp")
          .mockImplementation();
        const passwordForm = screen.getByTestId("passwordForm");

        fireEvent.blur(passwordForm);
        fireEvent.submit(form);
        /**
         * Since fireEvent.submit is not async function we cannot use await
         * Without an await, expect(mockSignUp) assertion can run before
         * fireEvent.submit can complete execution causing the test to fail.
         * Therefore, we await on dummy Promise to delay execution while
         * fireEvent.submit completes.
         */
        await new Promise((r) => setTimeout(r, 1));
        expect(mockSignUp).not.toBeCalled();
      });
    });

    describe("On success", () => {
      it("should call signUp if fields are valid", async () => {
        screen.getByTestId("SignUpTabButton").click();

        const fields = {
          emailForm: "daniel.zingaro@mail.utoronto.ca",
          userNameForm: "zingarod",
          passwordForm: "password",
          confirmPassForm: "password",
          firstNameForm: "Daniel",
          lastNameForm: "Zingaro",
        };
        Object.keys(fields).forEach((key) => {
          fireEvent.change(
            screen.getByTestId(key).querySelector("input") as HTMLInputElement,
            { target: { value: fields[key as keyof typeof fields] } }
          );
        });

        const form = screen.getByTestId("form");
        const mockSignUp = jest
          .spyOn(ServerApi.prototype, "signUp")
          .mockImplementation(() =>
            Promise.resolve({ response: {} as AxiosResponse })
          );
        const formData = {
          email: "daniel.zingaro@mail.utoronto.ca",
          userName: "zingarod",
          password: "password",
          firstName: "Daniel",
          lastName: "Zingaro",
        };

        await act(async () => {
          fireEvent.submit(form);
          await new Promise((r) => setTimeout(r, 1));
        });
        expect(mockSignUp).toBeCalledWith(formData);

      });
    });
  });
});

describe("SignIn component", () => {
  describe("handleSubmit function", () => {
    describe("On error", () => {
      it("should not call SignIn if form is missing fields", async () => {
        screen.getByTestId("SignInTabButton").click();

        const form = screen.getByTestId("form");
        const mockSignIn = jest
          .spyOn(ServerApi.prototype, "signIn")
          .mockImplementation();

        fireEvent.submit(form);
        expect(mockSignIn).not.toBeCalled();
      });

      it("should not call SignIn if errors are present", async () => {
        screen.getByTestId("SignInTabButton").click();

        const form = screen.getByTestId("form");
        const mockSignIn = jest
          .spyOn(ServerApi.prototype, "signIn")
          .mockImplementation();
        const passwordForm = screen.getByTestId("passwordForm");

        fireEvent.blur(passwordForm);
        fireEvent.submit(form);
        /**
         * Since fireEvent.submit is not async function we cannot use await
         * Without an await, expect(mockSignUp) assertion can run before
         * fireEvent.submit can complete execution causing the test to fail.
         * Therefore, we await on dummy Promise to delay execution while
         * fireEvent.submit completes.
         */
        await new Promise((r) => setTimeout(r, 1));
        expect(mockSignIn).not.toBeCalled();
      });
    });

    describe("On success", () => {
      it("should navigate to dashboard", async () => {
        screen.getByTestId("SignInTabButton").click();

        const fields = {
          userNameForm: "zingarod",
          passwordForm: "password",
        };
        Object.keys(fields).forEach((key) => {
          fireEvent.change(
            screen.getByTestId(key).querySelector("input") as HTMLInputElement,
            { target: { value: fields[key as keyof typeof fields] } }
          );
        });

        const form = screen.getByTestId("form");
        const mockSignIn = jest
          .spyOn(ServerApi.prototype, "signIn")
          .mockImplementation(() =>
            Promise.resolve({ response: {} as AxiosResponse })
          );
        const formData = {
          userName: "zingarod",
          password: "password",
        };

        fireEvent.submit(form);
        await new Promise((r) => setTimeout(r, 1));
        expect(mockSignIn).toBeCalledWith(formData);
        expect(mockNavigate).toBeCalled();
      });
    });
  });
});
