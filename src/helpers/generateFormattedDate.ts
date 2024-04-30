export const generateFormattedDate = (date: any) => {
  const day = new Date(date).getDate();
  const month = new Date(date).getMonth() + 1;
  const year = new Date(date).getFullYear();

  return `${day}.${month}.${year}`;
};
