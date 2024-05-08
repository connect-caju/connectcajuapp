import { NativeDateService } from "@ui-kitten/components";
import React, { useState, useEffect } from "react";
import { FormatDateOptions, FormatOptions } from "date-fns";


const i18n = {
  dayNames: {
    short: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    long: [
      "Segunda-Feira",
      "Terça-Feira",
      "Quarta-Feira",
      "Quinta-Feira",
      "Sexta-Feira",
      "Sábado",
      "Domingo",
    ],
  },
  monthNames: {
    short: [
      "Jan",
      "Fev",
      "Març",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ],
    long: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
  },
};

export const dateLimits = {
  maximumDate: "2012-12-12",
  minimumDate: "1920-12-12",
};

export const localeDateService = new NativeDateService("pt", {

  // @ts-expect-error TS(2322): Type '{ dayNames: { short: string[]; long: string[... Remove this comment to see the full error message
  i18n,
  startDayOfWeek: 1,
});

export const useDatepickerState = (initialDate = null) => {
  const [date, setDate] = useState(initialDate);
  return { date, onSelect: setDate };
};

export const getFullYears = (count = 20) => {
  let years: string[] = [];
  let startYear = new Date().getFullYear();
  for (let i = 0; i <= count; i++) {
    // years.push((new Date().getFullYear() - i).toString());
    years.push((startYear - i).toString());
  }
  return years;
};

export const getFullYears2 = (count = 20) => {
  let years = [];
  for (let i = 0; i <= count; i++) {
    years[i] = { key: i, value: (new Date().getFullYear() - i).toString() };
  }
  return years;
};

interface MonthKey {
  [key: string]: string;
}

export const months: MonthKey = {
  0: "Janeiro",
  1: "Fevereiro",
  2: "Março",
  3: "Abril",
  4: "Maio",
  5: "Junho",
  6: "Julho",
  7: "Agosto",
  8: "Setembro",
  9: "Outubro",
  10: "Novembro",
  11: "Dezembro",
};

export function calculateAge(dateOfBirth: any) {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  const yearsDiff = today.getFullYear() - dob.getFullYear();
  const monthsDiff = today.getMonth() - dob.getMonth();
  const daysDiff = today.getDate() - dob.getDate();

  if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
    return yearsDiff - 1;
  } else {
    return yearsDiff;
  }
}

export function calculateAge2(birthDate: Date) {
  // Convert birth date string to a Date object
  const birthDateObj = new Date(birthDate);

  // Get the current date
  const today = new Date();

  // Calculate the difference in years
  let age = today.getFullYear() - birthDateObj.getFullYear();

  // If the birth date hasn't occurred yet this year, subtract one from the age
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  return age;
}

export const dateFormatter = (date: Date)=>{
  
  const ptBRDateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const formattedDate = ptBRDateFormatter.format(date);
  return formattedDate;
}