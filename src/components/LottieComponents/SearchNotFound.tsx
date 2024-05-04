
import LottieView from "lottie-react-native";
import { View } from "react-native";
import React from "react";

const SearchNotFound = () => {
    return (
        <View
            style={{
                width: 100,
                height: 100,
            }}
        >
            <LottieView
                source={require("../../../assets/lottie/searchNotFound.json")}
                style={{}}
                autoPlay
                loop
            />
        </View>
    );
};

export default SearchNotFound;
