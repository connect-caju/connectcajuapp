/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import LottieView from "lottie-react-native";

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
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

                // @ts-expect-error TS(2591): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
                source={require("../../../assets/lottie/searchNotFound.json")}
                style={{}}
                autoPlay
                loop
            />
        </View>
    );
};

export default SearchNotFound;
