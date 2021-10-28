import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Log In page", () => {
  render(<App />);
  const input = screen.getByText("Log In");
  expect(input).toBeInTheDocument();
});
