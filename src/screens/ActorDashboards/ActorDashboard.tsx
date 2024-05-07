import { View, Text } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FarmersStackParamList } from '../../navigation/Stacks/FarmersStackScreen';

type Props = NativeStackScreenProps<FarmersStackParamList, "ActorDashboard">;


export default function ActorDashboard({ route, navigation }: Props) {
    const { actorId } = route.params;
  return (
    <View>
      <Text>ActorDashboard</Text>
    </View>
  )
}