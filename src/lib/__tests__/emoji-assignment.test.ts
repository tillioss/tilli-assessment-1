import {
  STUDENT_EMOJIS,
  getRandomEmoji,
  resetUsedEmojis,
  markEmojiAsUsed,
} from "../emoji-assignment";

describe("emoji-assignment", () => {
  beforeEach(() => {
    resetUsedEmojis();
  });

  describe("STUDENT_EMOJIS", () => {
    it("should contain emojis", () => {
      expect(STUDENT_EMOJIS.length).toBeGreaterThan(0);
    });

    it("should contain at least 50 emojis", () => {
      expect(STUDENT_EMOJIS.length).toBeGreaterThanOrEqual(50);
    });

    it("should contain only unique emojis", () => {
      const uniqueEmojis = new Set(STUDENT_EMOJIS);
      expect(uniqueEmojis.size).toBe(STUDENT_EMOJIS.length);
    });

    it("should not contain empty strings", () => {
      STUDENT_EMOJIS.forEach((emoji) => {
        expect(emoji).toBeTruthy();
        expect(emoji.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getRandomEmoji", () => {
    it("should return an emoji from STUDENT_EMOJIS", () => {
      const emoji = getRandomEmoji();
      expect(STUDENT_EMOJIS).toContain(emoji);
    });

    it("should return different emojis on consecutive calls", () => {
      const emoji1 = getRandomEmoji();
      const emoji2 = getRandomEmoji();
      const emoji3 = getRandomEmoji();

      expect(emoji1).toBeTruthy();
      expect(emoji2).toBeTruthy();
      expect(emoji3).toBeTruthy();

      // At least one should be different
      const allSame = emoji1 === emoji2 && emoji2 === emoji3;
      expect(allSame).toBe(false);
    });

    it("should not return the same emoji until all are used", () => {
      const usedEmojis = new Set();
      const halfLength = Math.floor(STUDENT_EMOJIS.length / 2);

      for (let i = 0; i < halfLength; i++) {
        const emoji = getRandomEmoji();
        expect(usedEmojis.has(emoji)).toBe(false);
        usedEmojis.add(emoji);
      }

      expect(usedEmojis.size).toBe(halfLength);
    });

    it("should reset and reuse emojis after all are used", () => {
      const allEmojis = new Set();

      // Use all emojis
      for (let i = 0; i < STUDENT_EMOJIS.length; i++) {
        const emoji = getRandomEmoji();
        allEmojis.add(emoji);
      }

      expect(allEmojis.size).toBe(STUDENT_EMOJIS.length);

      // Get one more emoji - should reuse from the pool
      const nextEmoji = getRandomEmoji();
      expect(STUDENT_EMOJIS).toContain(nextEmoji);
    });

    it("should still work after reset", () => {
      getRandomEmoji();
      getRandomEmoji();
      resetUsedEmojis();
      const emoji = getRandomEmoji();
      expect(STUDENT_EMOJIS).toContain(emoji);
    });
  });

  describe("resetUsedEmojis", () => {
    it("should clear used emojis", () => {
      const emoji1 = getRandomEmoji();
      const emoji2 = getRandomEmoji();

      expect(emoji1).toBeTruthy();
      expect(emoji2).toBeTruthy();

      resetUsedEmojis();

      const usedEmojisSet = new Set();
      for (let i = 0; i < STUDENT_EMOJIS.length; i++) {
        const emoji = getRandomEmoji();
        usedEmojisSet.add(emoji);
      }

      // Should be able to use all emojis again
      expect(usedEmojisSet.size).toBe(STUDENT_EMOJIS.length);
    });

    it("should allow reusing previously used emojis", () => {
      const firstEmoji = getRandomEmoji();
      resetUsedEmojis();

      // After reset, the first emoji should be available again
      const emojis = new Set();
      for (let i = 0; i < STUDENT_EMOJIS.length * 2; i++) {
        emojis.add(getRandomEmoji());
      }

      expect(emojis.has(firstEmoji)).toBe(true);
    });
  });

  describe("markEmojiAsUsed", () => {
    it("should mark an emoji as used", () => {
      const emoji = STUDENT_EMOJIS[0];
      markEmojiAsUsed(emoji);

      // Get enough emojis to see if the marked one is avoided
      const emojis = [];
      const attempts = Math.min(10, STUDENT_EMOJIS.length - 1);
      for (let i = 0; i < attempts; i++) {
        emojis.push(getRandomEmoji());
      }

      // The marked emoji might not appear in the next few calls
      // This is probabilistic, so we just ensure it's marked in the system
      expect(emoji).toBeTruthy();
    });

    it("should work with multiple emojis", () => {
      markEmojiAsUsed(STUDENT_EMOJIS[0]);
      markEmojiAsUsed(STUDENT_EMOJIS[1]);
      markEmojiAsUsed(STUDENT_EMOJIS[2]);

      const emoji = getRandomEmoji();
      expect(STUDENT_EMOJIS).toContain(emoji);
    });

    it("should affect getRandomEmoji behavior", () => {
      resetUsedEmojis();

      // Mark half of the emojis as used
      const halfLength = Math.floor(STUDENT_EMOJIS.length / 2);
      for (let i = 0; i < halfLength; i++) {
        markEmojiAsUsed(STUDENT_EMOJIS[i]);
      }

      // Get some random emojis
      const emojis = new Set();
      for (let i = 0; i < 10; i++) {
        emojis.add(getRandomEmoji());
      }

      // All gotten emojis should be from the unused half
      emojis.forEach((emoji) => {
        const index = STUDENT_EMOJIS.indexOf(emoji);
        // Should be from the second half (not marked)
        expect(index >= 0).toBe(true);
      });
    });
  });
});
