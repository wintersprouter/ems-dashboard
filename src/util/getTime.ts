export function getTimeFormat(minute: number) {
  const totalMinutesInADay = 1440; // 24 * 60
  const adjustedMinutes = minute % totalMinutesInADay; // 確保分鐘數在一天內
  const hour = Math.floor(adjustedMinutes / 60);
  const min = adjustedMinutes % 60;
  return `${hour > 9 ? "" : "0"}${hour}:${min > 9 ? "" : "0"}${min}`;
}
export function formatDateString(dateString: string) {
  // 將字串轉換為 Date 物件
  const date = new Date(dateString);

  // 獲取各個部分
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份從0開始，所以需要加1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // 組合成所需的格式
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
