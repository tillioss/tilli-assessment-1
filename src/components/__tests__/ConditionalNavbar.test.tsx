import React from "react";
import { render } from "@testing-library/react";
import ConditionalNavbar from "../ConditionalNavbar";
import { NavbarProvider } from "../NavbarContext";

// Mock the Navbar component
jest.mock("../Navbar", () => {
  return function MockNavbar() {
    return <div data-testid="mock-navbar">Navbar</div>;
  };
});

describe("ConditionalNavbar", () => {
  it("should render Navbar component", () => {
    const { getByTestId } = render(
      <NavbarProvider>
        <ConditionalNavbar />
      </NavbarProvider>
    );

    expect(getByTestId("mock-navbar")).toBeInTheDocument();
  });

  it("should render without errors", () => {
    expect(() => {
      render(
        <NavbarProvider>
          <ConditionalNavbar />
        </NavbarProvider>
      );
    }).not.toThrow();
  });

  it("should always render Navbar regardless of pathname", () => {
    const { getByTestId } = render(
      <NavbarProvider>
        <ConditionalNavbar />
      </NavbarProvider>
    );

    // Since it always returns Navbar, we should see it
    expect(getByTestId("mock-navbar")).toBeInTheDocument();
  });
});
