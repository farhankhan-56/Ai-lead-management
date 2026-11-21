const PART_TYPES = ["year", "month", "day", "hour", "minute", "second"] as const;

function getWallClock(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const [year, month, day, hour, minute, second] = PART_TYPES.map((type) =>
    Number(parts.find((part) => part.type === type)?.value),
  );
  return { year, month, day, asUtcMs: Date.UTC(year, month - 1, day, hour, minute, second) };
}

function getOffsetMs(instant: Date, timeZone: string): number {
  const wallClock = getWallClock(instant, timeZone);
  return wallClock.asUtcMs - Math.floor(instant.getTime() / 1000) * 1000;
}

// Returns the instant at which the current calendar day started in the given time zone.
export function getLocalMidnight(timeZone: string, now: Date = new Date()): Date {
  const { year, month, day } = getWallClock(now, timeZone);
  const midnightAsUtcMs = Date.UTC(year, month - 1, day);
  const firstGuess = new Date(midnightAsUtcMs - getOffsetMs(now, timeZone));
  return new Date(midnightAsUtcMs - getOffsetMs(firstGuess, timeZone));
}