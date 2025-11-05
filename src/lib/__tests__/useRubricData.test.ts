import { renderHook } from "@testing-library/react";
import { useRubricData } from "../useRubricData";

describe("useRubricData", () => {
  it("should return rubric data with rating levels", () => {
    const { result } = renderHook(() => useRubricData());

    expect(result.current).toHaveProperty("ratingLevels");
    expect(result.current.ratingLevels).toHaveProperty("0");
    expect(result.current.ratingLevels).toHaveProperty("1");
    expect(result.current.ratingLevels).toHaveProperty("2");
    expect(result.current.ratingLevels).toHaveProperty("3");
  });

  it("should return rating levels with correct keys", () => {
    const { result } = renderHook(() => useRubricData());

    const levels = result.current.ratingLevels;
    expect(levels["0"]).toBe("rubric.ratingLevels.0");
    expect(levels["1"]).toBe("rubric.ratingLevels.1");
    expect(levels["2"]).toBe("rubric.ratingLevels.2");
    expect(levels["3"]).toBe("rubric.ratingLevels.3");
  });

  it("should return skill categories array", () => {
    const { result } = renderHook(() => useRubricData());

    expect(result.current).toHaveProperty("skillCategories");
    expect(Array.isArray(result.current.skillCategories)).toBe(true);
  });

  it("should return 11 skill categories", () => {
    const { result } = renderHook(() => useRubricData());

    expect(result.current.skillCategories).toHaveLength(11);
  });

  it("should have proper structure for each skill category", () => {
    const { result } = renderHook(() => useRubricData());

    result.current.skillCategories.forEach((category) => {
      expect(category).toHaveProperty("categoryName");
      expect(category).toHaveProperty("criteria");
      expect(Array.isArray(category.criteria)).toBe(true);
      expect(category.criteria.length).toBeGreaterThan(0);
    });
  });

  it("should have proper structure for each criterion", () => {
    const { result } = renderHook(() => useRubricData());

    result.current.skillCategories.forEach((category) => {
      category.criteria.forEach((criterion) => {
        expect(criterion).toHaveProperty("id");
        expect(criterion).toHaveProperty("text");
        expect(criterion).toHaveProperty("example");
        expect(typeof criterion.id).toBe("string");
        expect(typeof criterion.text).toBe("string");
        expect(typeof criterion.example).toBe("string");
      });
    });
  });

  it("should return self-awareness social awareness category", () => {
    const { result } = renderHook(() => useRubricData());

    const category = result.current.skillCategories.find((cat) =>
      cat.categoryName.includes("selfAwarenessSocialAwareness")
    );
    expect(category).toBeDefined();
    if (category) {
      expect(category.criteria).toHaveLength(1);
      expect(category.criteria[0].id).toBe("sa_1");
    }
  });

  it("should return self-awareness category", () => {
    const { result } = renderHook(() => useRubricData());

    const category = result.current.skillCategories.find(
      (cat) =>
        cat.categoryName.includes("selfAwareness") &&
        !cat.categoryName.includes("socialAwareness")
    );
    expect(category).toBeDefined();
  });

  it("should return self-management metacognition category", () => {
    const { result } = renderHook(() => useRubricData());

    const category = result.current.skillCategories.find((cat) =>
      cat.categoryName.includes("selfManagementMetacognition")
    );
    expect(category).toBeDefined();
    if (category) {
      expect(category.criteria[0].id).toBe("sa_3");
    }
  });

  it("should return metacognition critical thinking category", () => {
    const { result } = renderHook(() => useRubricData());

    const category = result.current.skillCategories.find((cat) =>
      cat.categoryName.includes("metacognitionCriticalThinking")
    );
    expect(category).toBeDefined();
    if (category) {
      expect(category.criteria[0].id).toBe("sm_1");
    }
  });

  it("should return empathy social awareness category", () => {
    const { result } = renderHook(() => useRubricData());

    const category = result.current.skillCategories.find((cat) =>
      cat.categoryName.includes("empathySocialAwareness")
    );
    expect(category).toBeDefined();
    if (category) {
      expect(category.criteria[0].id).toBe("sm_2");
    }
  });

  it("should return empathy relationship skills category", () => {
    const { result } = renderHook(() => useRubricData());

    const category = result.current.skillCategories.find((cat) =>
      cat.categoryName.includes("empathyRelationshipSkills")
    );
    expect(category).toBeDefined();
    if (category) {
      expect(category.criteria[0].id).toBe("sm_3");
    }
  });

  it("should return responsible decision making critical thinking category", () => {
    const { result } = renderHook(() => useRubricData());

    const category = result.current.skillCategories.find((cat) =>
      cat.categoryName.includes("responsibleDecisionMakingCriticalThinking")
    );
    expect(category).toBeDefined();
    if (category) {
      expect(category.criteria[0].id).toBe("sm_4");
    }
  });

  it("should return self-management category", () => {
    const { result } = renderHook(() => useRubricData());

    const categories = result.current.skillCategories.filter((cat) =>
      cat.categoryName.includes("selfManagement")
    );
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should return self-management responsible decision making category", () => {
    const { result } = renderHook(() => useRubricData());

    const category = result.current.skillCategories.find((cat) =>
      cat.categoryName.includes("selfManagementResponsibleDecisionMaking")
    );
    expect(category).toBeDefined();
    if (category) {
      expect(category.criteria[0].id).toBe("sm_6");
    }
  });

  it("should return metacognition self awareness category", () => {
    const { result } = renderHook(() => useRubricData());

    const category = result.current.skillCategories.find((cat) =>
      cat.categoryName.includes("metacognitionSelfAwareness")
    );
    expect(category).toBeDefined();
    if (category) {
      expect(category.criteria[0].id).toBe("sm_7");
    }
  });

  it("should return metacognition category", () => {
    const { result } = renderHook(() => useRubricData());

    const categories = result.current.skillCategories.filter((cat) =>
      cat.categoryName.includes("metacognition")
    );
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should have all criteria with unique IDs", () => {
    const { result } = renderHook(() => useRubricData());

    const allIds: string[] = [];
    result.current.skillCategories.forEach((category) => {
      category.criteria.forEach((criterion) => {
        allIds.push(criterion.id);
      });
    });

    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it("should return consistent data on multiple renders", () => {
    const { result, rerender } = renderHook(() => useRubricData());

    const firstResult = result.current;
    rerender();
    const secondResult = result.current;

    expect(firstResult.ratingLevels).toEqual(secondResult.ratingLevels);
    expect(firstResult.skillCategories.length).toBe(
      secondResult.skillCategories.length
    );
  });

  it("should have translation keys for all criteria text", () => {
    const { result } = renderHook(() => useRubricData());

    result.current.skillCategories.forEach((category) => {
      category.criteria.forEach((criterion) => {
        expect(criterion.text).toContain("rubric.criteria");
        expect(criterion.example).toContain("rubric.criteria");
      });
    });
  });

  it("should have translation keys for all category names", () => {
    const { result } = renderHook(() => useRubricData());

    result.current.skillCategories.forEach((category) => {
      expect(category.categoryName).toContain("rubric.skillCategories");
    });
  });
});
