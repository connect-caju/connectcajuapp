

import { View, Text } from 'react-native'
import React from 'react'
import { useColorScheme } from "nativewind";
import {
    Box,
    FormControl,
    Stack,
    Select,
    CheckIcon,
    Center,
  } from "native-base";
import { inputStyles } from '../../styles/form-inputs';

interface InputLabelProps {
    label: string
}

export default function InputLabel({ label}: InputLabelProps) {
    const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <FormControl.Label
    _text={colorScheme === 'light' ? inputStyles.light.label : inputStyles.dark.label}
  >
    {label}
  </FormControl.Label>
  )
}