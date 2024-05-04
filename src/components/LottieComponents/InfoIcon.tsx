
import LottieView from "lottie-react-native";
import { View } from "react-native";
import React from "react";

const InfoIcon = ({
    width,
    height
}: any) => {
    return (
        <View
            style={{
                width: width || 100,
                height: height || 100,
            }}
        >
            <LottieView
                source={require("../../../assets/lottie/infoIcon.json")}
                style={{}}
                autoPlay
                loop
            />
        </View>
    );
};

export default InfoIcon;
