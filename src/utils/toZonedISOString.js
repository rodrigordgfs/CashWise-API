export const toZonedISOString = (date, timeZone) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");

  // Cria a data formatada como ISO sem usar Z ou UTC
  const formatted = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

  // Adiciona offset de acordo com o horário de São Paulo
  // Para simplificar: SP = -03:00 no horário padrão e -02:00 no horário de verão
  const offsetMinutes = -new Date().toLocaleString("en-US", { timeZone, timeZoneName: "short" }).includes("GMT-2")
    ? 180
    : 120;
  const totalOffset = offsetMinutes;

  const sign = totalOffset <= 0 ? "+" : "-";
  const absOffset = Math.abs(totalOffset);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, "0");
  const offsetMins = String(absOffset % 60).padStart(2, "0");

  return `${formatted}${sign}${offsetHours}:${offsetMins}`;
}