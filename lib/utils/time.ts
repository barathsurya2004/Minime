export function getTimeContext() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 0 && hour < 7) return "late night";
  if (hour < 12) return "morning";
  if (hour < 17) return "daytime";
  if (hour < 21) return "evening";
  return "night";
}
