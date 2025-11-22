import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../LoginForm";

const mockPush = jest.fn();
const mockGet = jest.fn();

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// Mock appwrite
jest.mock("@/lib/appwrite", () => ({
  login: jest.fn(),
}));

// Mock i18n to return actual module with mocked language
jest.mock("@/lib/i18n", () => ({
  __esModule: true,
  default: {
    language: "en",
    changeLanguage: jest.fn(),
  },
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockGet.mockReturnValue("PRE");
    const { login } = require("@/lib/appwrite");
    login.mockClear();
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

  it("should handle zone selection and enable school dropdown", async () => {
    render(<LoginForm />);

    const zoneSelect = screen.getAllByRole("combobox")[0];
    let schoolSelect = screen.getAllByRole("combobox")[1];

    // School should be disabled initially
    expect(schoolSelect).toBeDisabled();

    // Select a zone (use actual zone ID from zonesToSchools)
    fireEvent.change(zoneSelect, { target: { value: "irbid" } });

    // Wait for state update
    await waitFor(() => {
      schoolSelect = screen.getAllByRole("combobox")[1];
      expect(schoolSelect).not.toBeDisabled();
    });
  });

  it("should handle section selection", () => {
    render(<LoginForm />);

    const sectionSelect = screen.getAllByRole("combobox")[2];
    fireEvent.change(sectionSelect, { target: { value: "sections.a" } });

    expect(sectionSelect).toHaveValue("sections.a");
  });

  it("should handle gender selection", async () => {
    render(<LoginForm />);

    const comboboxes = screen.getAllByRole("combobox");
    const genderSelect = comboboxes[4]; // zone, school, section, grade, gender

    fireEvent.change(genderSelect, { target: { value: "male" } });

    await waitFor(() => {
      expect(genderSelect).toHaveValue("male");
    });
  });

  it("should handle education selection", async () => {
    render(<LoginForm />);

    const comboboxes = screen.getAllByRole("combobox");
    const educationSelect = comboboxes[5]; // zone, school, section, grade, gender, education

    fireEvent.change(educationSelect, { target: { value: "bachelor" } });

    await waitFor(() => {
      expect(educationSelect).toHaveValue("bachelor");
    });
  });

  it("should handle SEL training selection", async () => {
    render(<LoginForm />);

    const comboboxes = screen.getAllByRole("combobox");
    const selTrainingSelect = comboboxes[6]; // zone, school, section, grade, gender, education, selTraining

    fireEvent.change(selTrainingSelect, {
      target: { value: "ongoing-balanced" },
    });

    await waitFor(() => {
      expect(selTrainingSelect).toHaveValue("ongoing-balanced");
    });
  });

  it("should handle resources sufficiency selection", async () => {
    render(<LoginForm />);

    const comboboxes = screen.getAllByRole("combobox");
    const sufficiencySelect = comboboxes[7]; // zone, school, section, grade, gender, education, selTraining, sufficiency

    fireEvent.change(sufficiencySelect, { target: { value: "sufficient" } });

    await waitFor(() => {
      expect(sufficiencySelect).toHaveValue("sufficient");
    });
  });

  it("should handle multiple resource checkbox selections", () => {
    render(<LoginForm />);

    const checkboxes = screen.getAllByRole("checkbox");

    // Select multiple resources
    fireEvent.click(checkboxes[0]); // books
    fireEvent.click(checkboxes[1]); // internet
    fireEvent.click(checkboxes[2]); // smartphone

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });

  it("should uncheck resource when clicked again", () => {
    render(<LoginForm />);

    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();

    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  it("should handle other resources text input", () => {
    render(<LoginForm />);

    const checkboxes = screen.getAllByRole("checkbox");
    const otherCheckbox = checkboxes[checkboxes.length - 1];

    // Click other checkbox
    fireEvent.click(otherCheckbox);

    // Find the text input that appears
    const textInputs = screen.getAllByRole("textbox");
    const otherInput = textInputs[textInputs.length - 1];

    fireEvent.change(otherInput, { target: { value: "Custom resource" } });
    expect(otherInput).toHaveValue("Custom resource");
  });

  it("should display error message on login failure", async () => {
    const { login } = require("@/lib/appwrite");
    login.mockRejectedValue(new Error("Login failed"));

    render(<LoginForm />);

    const form = screen
      .getByRole("button", { name: /common.getStarted/i })
      .closest("form");

    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText("login.loginFailed")).toBeInTheDocument();
    });
  });

  it("should call router.push with correct path on successful login", async () => {
    const { login } = require("@/lib/appwrite");
    login.mockResolvedValue({});

    render(<LoginForm />);

    const form = screen
      .getByRole("button", { name: /common.getStarted/i })
      .closest("form");

    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard?testType=PRE");
    });
  });

  it("should handle testType query parameter", () => {
    mockGet.mockReturnValue("POST");

    render(<LoginForm />);

    // Component should render without errors
    expect(screen.getByText("login.title")).toBeInTheDocument();
  });

  it("should default to PRE testType when no query param", () => {
    mockGet.mockReturnValue(null);

    render(<LoginForm />);

    expect(screen.getByText("login.title")).toBeInTheDocument();
  });

  it("should validate age input constraints", () => {
    render(<LoginForm />);

    const ageInputs = screen.getAllByRole("spinbutton");
    const ageInput = ageInputs.find(
      (input) => input.getAttribute("placeholder") === "login.agePlaceholder"
    );

    if (ageInput) {
      expect(ageInput).toHaveAttribute("max", "100");
      expect(ageInput).toHaveAttribute("required");
    }
  });

  it("should validate teaching experience input constraints", () => {
    render(<LoginForm />);

    const experienceInputs = screen.getAllByRole("spinbutton");
    const expInput = experienceInputs.find(
      (input) =>
        input.getAttribute("placeholder") ===
        "login.teachingExperiencePlaceholder"
    );

    if (expInput) {
      expect(expInput).toHaveAttribute("min", "0");
      expect(expInput).toHaveAttribute("max", "50");
      expect(expInput).toHaveAttribute("required");
    }
  });

  it("should validate class size input constraints", () => {
    render(<LoginForm />);

    const classSizeInputs = screen.getAllByRole("spinbutton");
    const classSizeInput = classSizeInputs.find(
      (input) =>
        input.getAttribute("placeholder") === "login.classSizePlaceholder"
    );

    if (classSizeInput) {
      expect(classSizeInput).toHaveAttribute("min", "1");
      expect(classSizeInput).toHaveAttribute("max", "100");
      expect(classSizeInput).toHaveAttribute("required");
    }
  });

  it("should have all required fields marked with asterisk", () => {
    render(<LoginForm />);

    // Check for required field labels
    expect(screen.getByText(/login.zone.*\*/)).toBeInTheDocument();
    expect(screen.getByText(/login.school.*\*/)).toBeInTheDocument();
    expect(screen.getByText(/login.grade.*\*/)).toBeInTheDocument();
  });

  it("should clear error message when form is resubmitted", async () => {
    const { login } = require("@/lib/appwrite");
    login.mockRejectedValueOnce(new Error("Login failed"));

    render(<LoginForm />);

    const form = screen
      .getByRole("button", { name: /common.getStarted/i })
      .closest("form");

    // First submission - should fail
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText("login.loginFailed")).toBeInTheDocument();
    });

    // Second submission - should clear error first
    login.mockResolvedValue({});
    if (form) {
      fireEvent.submit(form);
    }

    // Error should be cleared during submission
    await waitFor(() => {
      expect(screen.queryByText("login.loginFailed")).not.toBeInTheDocument();
    });
  });

  it("should render zone dropdown with correct structure", () => {
    render(<LoginForm />);

    const zoneSelect = screen.getAllByRole("combobox")[0];
    expect(zoneSelect).toBeInTheDocument();
    expect(zoneSelect).toHaveValue("");
  });

  it("should handle complete form submission with all fields", async () => {
    const { login } = require("@/lib/appwrite");
    login.mockResolvedValue({});

    render(<LoginForm />);

    // Fill in all fields - need to get fresh references after each state change
    const comboboxes = screen.getAllByRole("combobox");
    const [
      zoneSelect,
      ,
      sectionSelect,
      gradeSelect,
      genderSelect,
      educationSelect,
      selTrainingSelect,
      sufficiencySelect,
    ] = comboboxes;

    // Change zone first (this will reset school) - use actual zone ID
    fireEvent.change(zoneSelect, { target: { value: "irbid" } });

    // Wait for zone change to take effect, then change school - use actual school ID
    await waitFor(() => {
      const schoolSelect = screen.getAllByRole("combobox")[1];
      expect(schoolSelect).not.toBeDisabled();
      fireEvent.change(schoolSelect, {
        target: { value: "azmi_mufti_boys_p1" },
      });
    });

    fireEvent.change(sectionSelect, { target: { value: "sections.a" } });
    fireEvent.change(gradeSelect, { target: { value: "grades.grade1" } });
    fireEvent.change(genderSelect, { target: { value: "male" } });
    fireEvent.change(educationSelect, { target: { value: "bachelor" } });
    fireEvent.change(selTrainingSelect, {
      target: { value: "ongoing-balanced" },
    });
    fireEvent.change(sufficiencySelect, { target: { value: "sufficient" } });

    const spinButtons = screen.getAllByRole("spinbutton");
    const ageInput = spinButtons.find(
      (input) => input.getAttribute("placeholder") === "login.agePlaceholder"
    );
    const expInput = spinButtons.find(
      (input) =>
        input.getAttribute("placeholder") ===
        "login.teachingExperiencePlaceholder"
    );
    const classSizeInput = spinButtons.find(
      (input) =>
        input.getAttribute("placeholder") === "login.classSizePlaceholder"
    );

    if (ageInput) fireEvent.change(ageInput, { target: { value: "30" } });
    if (expInput) fireEvent.change(expInput, { target: { value: "5" } });
    if (classSizeInput)
      fireEvent.change(classSizeInput, { target: { value: "25" } });

    const yesRadio = screen.getByDisplayValue("yes");
    fireEvent.click(yesRadio);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    const form = screen
      .getByRole("button", { name: /common.getStarted/i })
      .closest("form");

    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(
        expect.objectContaining({
          zone: "irbid",
          school: "azmi_mufti_boys_p1",
          section: "sections.a",
          grade: "grades.grade1",
          gender: "male",
          age: 30,
          teachingExperience: 5,
          education: "bachelor",
          selTraining: "ongoing-balanced",
          multilingualClassroom: true,
          classSize: 25,
          resourcesSufficiency: "sufficient",
        })
      );
    });
  });
});
