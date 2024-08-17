export function getTimeFormat(minute: number) {
  const hour = Math.floor(minute / 60);
  const min = minute % 60;
  return `${hour > 9 ? "" : "0"}${hour}:${min > 9 ? "" : "0"}${min}`;
}
