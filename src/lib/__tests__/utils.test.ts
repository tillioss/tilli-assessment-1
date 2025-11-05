import { cn, formatDate } from "../utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      const result = cn("class1", "class2");
      expect(result).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      const result = cn("class1", false && "class2", "class3");
      expect(result).toBe("class1 class3");
    });

    it("should merge tailwind classes without duplicates", () => {
      const result = cn("px-2 py-1", "px-4");
      expect(result).toContain("px-4");
      expect(result).toContain("py-1");
    });

    it("should handle empty input", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("should handle undefined and null values", () => {
      const result = cn("class1", undefined, null, "class2");
      expect(result).toBe("class1 class2");
    });

    it("should handle arrays of classes", () => {
      const result = cn(["class1", "class2"], "class3");
      expect(result).toBe("class1 class2 class3");
    });

    it("should handle object notation", () => {
      const result = cn({ class1: true, class2: false, class3: true });
      expect(result).toBe("class1 class3");
    });
  });

  describe("formatDate", () => {
    it("should format a Date object correctly", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date);
      expect(result).toMatch(/January 15, 2024/);
    });

    it("should format a date string correctly", () => {
      const dateString = "2024-03-20";
      const result = formatDate(dateString);
      expect(result).toMatch(/March 20, 2024/);
    });

    it("should format another date correctly", () => {
      const dateString = "2023-12-25";
      const result = formatDate(dateString);
      expect(result).toMatch(/December 25, 2023/);
    });

    it("should handle ISO date strings", () => {
      const isoString = "2024-06-15T12:00:00Z";
      const result = formatDate(isoString);
      expect(result).toContain("2024");
      expect(result).toContain("June");
    });
  });
});
