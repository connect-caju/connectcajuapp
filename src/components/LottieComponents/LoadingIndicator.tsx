/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";

const LoadingIndicator = ({ }) => {

    useEffect(() => {

    }, []);

    return (
        <View
            style={{
                width: 500,
                height: 500,
            }}
        >
            <LottieView

                // @ts-expect-error TS(2591): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
                source={require("../../../assets/lottie/loadingIndicator.json")}
                style={{}}
                autoPlay
                loop
            />
        </View>
    );
};

export default LoadingIndicator;
