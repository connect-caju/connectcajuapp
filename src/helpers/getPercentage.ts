/* eslint-disable prettier/prettier */
export const getPercentage = (num1: any, num2: any) => {
  const newNum1 = parseInt(num1);
  const newNum2 = parseInt(num2);
  if (newNum1 > 0 && newNum2 === 0) {
    return `${newNum1}`;
  }
  const percent = (newNum1 / num2) * 100;
  return Number.isNaN(percent) ? 0 : `${percent.toFixed(2)} %`;
};

export const getPercentage2 = (num1: any, num2: any) => {
  if (num2 !== 0) {
    return ((num1 / num2) * 10).toFixed(1);
  }
  else {
    return (num1 / num1).toFixed(1);
  }
};
