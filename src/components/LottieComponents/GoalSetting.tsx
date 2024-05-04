
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";

import React from "react";

const GoalSetting = () => {
    return (
        <View
            style={{
                width: 100,
                height: 100,
            }}
        >
            <LottieView
                source={require("../../../assets/lottie/goal.json")}
                style={{}}
                autoPlay
                loop
            />
        </View>
    );
};

export default GoalSetting;
