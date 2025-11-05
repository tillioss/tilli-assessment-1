import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "../Navbar";
import { NavbarProvider } from "../NavbarContext";

// Mock Next.js Link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("Navbar", () => {
  const renderNavbar = (
    initialShowBackButton = false,
    backHref = "",
    backLabel = ""
  ) => {
    return render(
      <NavbarProvider>
        <Navbar />
      </NavbarProvider>
    );
  };

  it("should render the navbar", () => {
    renderNavbar();

    expect(screen.getByText("navbar.title")).toBeInTheDocument();
  });

  it("should render the logo", () => {
    renderNavbar();

    const logo = screen.getByAltText("app.logoAlt");
    expect(logo).toBeInTheDocument();
  });

  it("should render LanguageSwitcher", () => {
    renderNavbar();

    // LanguageSwitcher should render a button
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should have proper styling classes", () => {
    const { container } = renderNavbar();

    const header = container.querySelector("header");
    expect(header).toHaveClass("bg-[#82A4DE]");
  });

  it("should render title with translation key", () => {
    renderNavbar();

    expect(screen.getByText("navbar.title")).toBeInTheDocument();
  });

  it("should render logo with correct attributes", () => {
    renderNavbar();

    const logo = screen.getByAltText("app.logoAlt");
    expect(logo).toHaveAttribute("src", "/images/logo/logo.png");
  });

  it("should not show back button initially", () => {
    const { container } = renderNavbar();

    const backLink = container.querySelector('a[href*="dashboard"]');
    expect(backLink).not.toBeInTheDocument();
  });

  it("should render with flex layout", () => {
    const { container } = renderNavbar();

    const header = container.querySelector("header");
    expect(header?.className).toContain("flex");
    expect(header?.className).toContain("justify-between");
  });

  it("should render with proper padding", () => {
    const { container } = renderNavbar();

    const header = container.querySelector("header");
    expect(header?.className).toContain("px-4");
    expect(header?.className).toContain("py-2");
  });
});
