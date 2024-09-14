export const formatDate = (inputDate: undefined | Date) => {
  const date = new Date(inputDate || "");

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const getMonthNameInNorwegian = (date: Date) => {
  const month = date.toLocaleDateString("no-NO", { month: "long" });
  return month.charAt(0).toUpperCase() + month.slice(1);
};
