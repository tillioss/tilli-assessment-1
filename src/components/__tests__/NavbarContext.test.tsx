import React from "react";
import { renderHook, act } from "@testing-library/react";
import { NavbarProvider, useNavbar } from "../NavbarContext";

describe("NavbarContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NavbarProvider>{children}</NavbarProvider>
  );

  it("should provide initial state", () => {
    const { result } = renderHook(() => useNavbar(), { wrapper });

    expect(result.current.showBackButton).toBe(false);
    expect(result.current.backHref).toBe("");
    expect(result.current.backLabel).toBe("");
  });

  it("should set back button with href and label", () => {
    const { result } = renderHook(() => useNavbar(), { wrapper });

    act(() => {
      result.current.setBackButton("/dashboard", "Back to Dashboard");
    });

    expect(result.current.showBackButton).toBe(true);
    expect(result.current.backHref).toBe("/dashboard");
    expect(result.current.backLabel).toBe("Back to Dashboard");
  });

  it("should hide back button", () => {
    const { result } = renderHook(() => useNavbar(), { wrapper });

    act(() => {
      result.current.setBackButton("/dashboard", "Back to Dashboard");
    });

    expect(result.current.showBackButton).toBe(true);

    act(() => {
      result.current.hideBackButton();
    });

    expect(result.current.showBackButton).toBe(false);
  });

  it("should maintain href and label after hiding", () => {
    const { result } = renderHook(() => useNavbar(), { wrapper });

    act(() => {
      result.current.setBackButton("/test", "Test Label");
    });

    act(() => {
      result.current.hideBackButton();
    });

    expect(result.current.backHref).toBe("/test");
    expect(result.current.backLabel).toBe("Test Label");
  });

  it("should update href and label when setBackButton is called again", () => {
    const { result } = renderHook(() => useNavbar(), { wrapper });

    act(() => {
      result.current.setBackButton("/first", "First");
    });

    expect(result.current.backHref).toBe("/first");
    expect(result.current.backLabel).toBe("First");

    act(() => {
      result.current.setBackButton("/second", "Second");
    });

    expect(result.current.backHref).toBe("/second");
    expect(result.current.backLabel).toBe("Second");
  });

  it("should throw error when useNavbar is used outside provider", () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useNavbar());
    }).toThrow("useNavbar must be used within NavbarProvider");

    console.error = originalError;
  });

  it("should allow multiple show/hide cycles", () => {
    const { result } = renderHook(() => useNavbar(), { wrapper });

    act(() => {
      result.current.setBackButton("/path1", "Label1");
    });
    expect(result.current.showBackButton).toBe(true);

    act(() => {
      result.current.hideBackButton();
    });
    expect(result.current.showBackButton).toBe(false);

    act(() => {
      result.current.setBackButton("/path2", "Label2");
    });
    expect(result.current.showBackButton).toBe(true);
    expect(result.current.backHref).toBe("/path2");
    expect(result.current.backLabel).toBe("Label2");
  });

  it("should handle empty strings for href and label", () => {
    const { result } = renderHook(() => useNavbar(), { wrapper });

    act(() => {
      result.current.setBackButton("", "");
    });

    expect(result.current.showBackButton).toBe(true);
    expect(result.current.backHref).toBe("");
    expect(result.current.backLabel).toBe("");
  });

  it("should provide all context values", () => {
    const { result } = renderHook(() => useNavbar(), { wrapper });

    expect(result.current).toHaveProperty("showBackButton");
    expect(result.current).toHaveProperty("backHref");
    expect(result.current).toHaveProperty("backLabel");
    expect(result.current).toHaveProperty("setBackButton");
    expect(result.current).toHaveProperty("hideBackButton");
  });

  it("should have setBackButton as a function", () => {
    const { result } = renderHook(() => useNavbar(), { wrapper });

    expect(typeof result.current.setBackButton).toBe("function");
  });

  it("should have hideBackButton as a function", () => {
    const { result } = renderHook(() => useNavbar(), { wrapper });

    expect(typeof result.current.hideBackButton).toBe("function");
  });
});
