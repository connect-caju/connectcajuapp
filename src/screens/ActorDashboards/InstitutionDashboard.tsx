import { View, Text } from 'react-native'
import React from 'react'
import { FarmersStackParamList } from '../../navigation/Stacks/FarmersStackScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<FarmersStackParamList, "InstitutionDashboard">;

export default function InstitutionDashboard({ route, navigation }: Props) {

    const { institutionId } = route.params;
  return (
    <View>
      <Text>InstitutionDashboard</Text>
    </View>
  )
}