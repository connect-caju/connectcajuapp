import { View, Text } from 'react-native'
import React from 'react'
import { FarmersStackParamList } from '../../navigation/Stacks/FarmersStackScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<FarmersStackParamList, "CoopDashboard">;

export default function CoopDashboard({ route, navigation }: Props) {

    const { coopId } = route.params;
  return (
    <View>
      <Text>CoopDashboard</Text>
    </View>
  )
}