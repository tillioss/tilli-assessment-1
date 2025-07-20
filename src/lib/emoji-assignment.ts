// List of emojis that can be assigned to students (no animals)
export const STUDENT_EMOJIS = [
  "🌱",
  "🌿",
  "🍀",
  "🎋",
  "🍃",
  "🍂",
  "🍁",
  "🌵",
  "🌴",
  "🌳",
  "🌲",
  "🌸",
  "🌼",
  "🌻",
  "🌺",
  "🌷",
  "🌹",
  "💐",
  "☀️",
  "🌤️",
  "⛅",
  "🌦️",
  "🌧️",
  "🌈",
  "❄️",
  "🌬️",
  "🌪️",
  "🌊",
  "🌌",
  "🌙",
  "⭐",
  "🌟",
  "✨",
  "☁️",
  "⛈️",
  "💫",
  "🔮",
  "🪄",
  "🎈",
  "🎀",
  "🧸",
  "🎁",
  "📦",
  "📚",
  "🎨",
  "🧩",
  "🎯",
  "🪁",
  "🧼",
  "📅",
  "🕹️",
  "🛼",
  "🧺",
  "📍",
  "📌",
  "📎",
  "🧷",
];

// Track used emojis to avoid duplicates
let usedEmojis = new Set<string>();

/**
 * Get a random emoji that hasn't been used yet
 * @returns A random emoji string
 */
export function getRandomEmoji(): string {
  const availableEmojis = STUDENT_EMOJIS.filter(
    (emoji) => !usedEmojis.has(emoji)
  );

  // If all emojis are used, reset the used emojis set
  if (availableEmojis.length === 0) {
    usedEmojis.clear();
    return STUDENT_EMOJIS[Math.floor(Math.random() * STUDENT_EMOJIS.length)];
  }

  const randomEmoji =
    availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
  usedEmojis.add(randomEmoji);
  return randomEmoji;
}

/**
 * Reset the used emojis set (useful for testing or when starting a new session)
 */
export function resetUsedEmojis(): void {
  usedEmojis.clear();
}

/**
 * Mark an emoji as used (useful when loading existing data)
 * @param emoji The emoji to mark as used
 */
export function markEmojiAsUsed(emoji: string): void {
  usedEmojis.add(emoji);
}
