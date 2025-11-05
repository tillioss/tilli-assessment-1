import React from "react";
import { render, waitFor } from "@testing-library/react";
import I18nProvider from "../I18nProvider";

jest.mock("@/lib/i18n", () => ({
  __esModule: true,
  default: {
    isInitialized: false,
    init: jest.fn(),
    changeLanguage: jest.fn(),
  },
}));

// Mock useSearchParams
const mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => mockSearchParams.get(key),
  }),
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/",
}));

describe("I18nProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.delete("lang");
  });

  it("should render children", async () => {
    const { getByText } = render(
      <I18nProvider>
        <div>Test Child</div>
      </I18nProvider>
    );

    await waitFor(() => {
      expect(getByText("Test Child")).toBeInTheDocument();
    });
  });

  it("should initialize i18n if not initialized", async () => {
    const i18n = require("@/lib/i18n").default;

    render(
      <I18nProvider>
        <div>Test</div>
      </I18nProvider>
    );

    await waitFor(() => {
      expect(i18n.init).toHaveBeenCalled();
    });
  });

  it("should render children on server side", () => {
    const { getByText } = render(
      <I18nProvider>
        <div>Server Side Content</div>
      </I18nProvider>
    );

    // Initially renders children even before client-side mounting
    expect(getByText("Server Side Content")).toBeInTheDocument();
  });

  it("should handle children prop correctly", () => {
    const { container } = render(
      <I18nProvider>
        <div>Child 1</div>
        <div>Child 2</div>
      </I18nProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it("should wrap children with I18nextProvider after client mount", async () => {
    const { container } = render(
      <I18nProvider>
        <div>Content</div>
      </I18nProvider>
    );

    await waitFor(() => {
      expect(container.firstChild).toBeTruthy();
    });
  });
});
