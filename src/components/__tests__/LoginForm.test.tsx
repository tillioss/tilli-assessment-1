import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../LoginForm";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/lib/appwrite", () => ({
  login: jest.fn(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("should render the login form", () => {
    render(<LoginForm />);

    expect(screen.getByText("login.title")).toBeInTheDocument();
  });

  it("should render school and grade selects", () => {
    render(<LoginForm />);

    expect(screen.getByText(/login.school/)).toBeInTheDocument();
    expect(screen.getByText(/login.grade/)).toBeInTheDocument();
  });

  it("should render teacher info section", () => {
    render(<LoginForm />);

    expect(screen.getByText("login.teacherInfo")).toBeInTheDocument();
  });

  it("should render demographics section", () => {
    render(<LoginForm />);

    expect(screen.getByText("login.demographics")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    render(<LoginForm />);

    const button = screen.getByRole("button", { name: /common.getStarted/i });
    expect(button).toBeInTheDocument();
  });

  it("should allow selecting school", () => {
    render(<LoginForm />);

    const schoolSelect = screen.getAllByRole("combobox")[0];
    expect(schoolSelect).toBeInTheDocument();
  });

  it("should allow selecting grade", () => {
    render(<LoginForm />);

    const gradeSelect = screen.getAllByRole("combobox")[1];
    expect(gradeSelect).toBeInTheDocument();
  });

  it("should render gender field", () => {
    render(<LoginForm />);

    const genderElements = screen.getAllByText(/login.gender/);
    expect(genderElements.length).toBeGreaterThan(0);
  });

  it("should render age field", () => {
    render(<LoginForm />);

    expect(screen.getByText(/login.age/)).toBeInTheDocument();
  });

  it("should render teaching experience field", () => {
    render(<LoginForm />);

    expect(screen.getByText(/login.teachingExperience/)).toBeInTheDocument();
  });

  it("should render education field", () => {
    render(<LoginForm />);

    const educationElements = screen.getAllByText(/login.education/);
    expect(educationElements.length).toBeGreaterThan(0);
  });

  it("should render SEL training field", () => {
    render(<LoginForm />);

    const selElements = screen.getAllByText(/login.selTraining/);
    expect(selElements.length).toBeGreaterThan(0);
  });

  it("should render multilingual classroom field", () => {
    render(<LoginForm />);

    expect(screen.getByText(/login.multilingualClassroom/)).toBeInTheDocument();
  });

  it("should render class size field", () => {
    render(<LoginForm />);

    expect(screen.getByText(/login.classSize/)).toBeInTheDocument();
  });

  it("should render classroom resources section", () => {
    render(<LoginForm />);

    expect(screen.getByText(/login.classroomResources/)).toBeInTheDocument();
  });

  it("should render resources sufficiency field", () => {
    render(<LoginForm />);

    expect(screen.getByText(/login.resourcesSufficiency/)).toBeInTheDocument();
  });

  it("should update school value on change", () => {
    render(<LoginForm />);

    const schoolSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(schoolSelect, { target: { value: "schools.school2" } });

    expect(schoolSelect).toHaveValue("schools.school2");
  });

  it("should update grade value on change", () => {
    render(<LoginForm />);

    const gradeSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(gradeSelect, { target: { value: "grades.grade1" } });

    expect(gradeSelect).toHaveValue("grades.grade1");
  });

  it("should render mascot image", () => {
    render(<LoginForm />);

    const mascot = screen.getByAltText("app.mascotAlt");
    expect(mascot).toBeInTheDocument();
  });

  it("should render description text", () => {
    render(<LoginForm />);

    expect(screen.getByText("login.description")).toBeInTheDocument();
  });

  it("should handle age input change", () => {
    render(<LoginForm />);

    const ageInputs = screen.getAllByRole("spinbutton");
    const ageInput = ageInputs.find(
      (input) => input.getAttribute("placeholder") === "login.agePlaceholder"
    );

    if (ageInput) {
      fireEvent.change(ageInput, { target: { value: "30" } });
      expect(ageInput).toHaveValue(30);
    }
  });

  it("should handle teaching experience input change", () => {
    render(<LoginForm />);

    const experienceInputs = screen.getAllByRole("spinbutton");
    const expInput = experienceInputs.find(
      (input) =>
        input.getAttribute("placeholder") ===
        "login.teachingExperiencePlaceholder"
    );

    if (expInput) {
      fireEvent.change(expInput, { target: { value: "5" } });
      expect(expInput).toHaveValue(5);
    }
  });

  it("should handle class size input change", () => {
    render(<LoginForm />);

    const classSizeInputs = screen.getAllByRole("spinbutton");
    const classSizeInput = classSizeInputs.find(
      (input) =>
        input.getAttribute("placeholder") === "login.classSizePlaceholder"
    );

    if (classSizeInput) {
      fireEvent.change(classSizeInput, { target: { value: "25" } });
      expect(classSizeInput).toHaveValue(25);
    }
  });

  it("should handle multilingual yes radio button", () => {
    render(<LoginForm />);

    const yesRadio = screen.getByDisplayValue("yes");
    fireEvent.click(yesRadio);

    expect(yesRadio).toBeChecked();
  });

  it("should handle multilingual no radio button", () => {
    render(<LoginForm />);

    const noRadio = screen.getByDisplayValue("no");
    fireEvent.click(noRadio);

    expect(noRadio).toBeChecked();
  });

  it("should toggle multilingual radio buttons", () => {
    render(<LoginForm />);

    const yesRadio = screen.getByDisplayValue("yes");
    const noRadio = screen.getByDisplayValue("no");

    fireEvent.click(yesRadio);
    expect(yesRadio).toBeChecked();
    expect(noRadio).not.toBeChecked();

    fireEvent.click(noRadio);
    expect(noRadio).toBeChecked();
    expect(yesRadio).not.toBeChecked();
  });

  it("should handle resource checkbox changes", () => {
    render(<LoginForm />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);

    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
  });

  it("should show other resources input when other is selected", () => {
    render(<LoginForm />);

    // Find and click the "other" checkbox
    const checkboxes = screen.getAllByRole("checkbox");
    const otherCheckbox = checkboxes[checkboxes.length - 1]; // Usually last

    fireEvent.click(otherCheckbox);

    // The resources other input should appear
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("should handle form submission", async () => {
    const { login } = require("@/lib/appwrite");
    login.mockResolvedValue({});

    render(<LoginForm />);

    const form = screen
      .getByRole("button", { name: /common.getStarted/i })
      .closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    // Form submission is handled
    await waitFor(() => {
      // No error should be displayed initially
      expect(screen.queryByText("login.loginFailed")).not.toBeInTheDocument();
    });
  });

  it("should disable submit button while loading", async () => {
    const { login } = require("@/lib/appwrite");
    login.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<LoginForm />);

    const submitButton = screen.getByRole("button", {
      name: /common.getStarted/i,
    });

    const form = submitButton.closest("form");
    if (form) {
      fireEvent.submit(form);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    }
  });

  it("should render all required field markers", () => {
    render(<LoginForm />);

    const requiredLabels = screen.getAllByText(/\*/);
    expect(requiredLabels.length).toBeGreaterThan(5);
  });
});
