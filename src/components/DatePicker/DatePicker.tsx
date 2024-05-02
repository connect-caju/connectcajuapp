import React, { useState } from "react";
import DatePicker from "react-native-date-picker";
import { dateLimits } from "../../helpers/dates";

interface MyDatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function MyDatePicker({
  date,
  setDate,
  open,
  setOpen,
}: MyDatePickerProps) {
  const [state, setState] = useState("idle");

  return (
    <DatePicker
      onStateChange={(state) => setState(state)}
      modal
      open={open}
      onConfirm={(date) => {
        setOpen(false);
        setDate(date);
      }}
      onCancel={() => {
        setOpen(false);
        // setDate(dateLimits);
      }}
      maximumDate={new Date(dateLimits.maximumDate)}
      minimumDate={new Date(dateLimits.minimumDate)}
      mode="date"
      date={date}
      onDateChange={setDate}
      locale="pt"
      title="Data de Nascimento"
      confirmText="Confirmar"
      cancelText="Cancelar"
      textColor="#000"
     
    />
  );
}
