export const formatToDDMonthNameYYYY = (input: string): string => {
  const date = new Date(input);

  if (isNaN(date.getTime())) return input; // handle invalid

  const day = date.getDate().toString().padStart(2, "0");
  const monthName = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${day}${monthName}${year}`;
};
