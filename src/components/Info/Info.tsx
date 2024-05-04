
import { View, Text } from "react-native";
import React from "react";

const Info = ({
    info
}: any) => {
    return (
        <View
            className="bg-gray-300 dark:bg-gray-800 p-2 rounded-xl w-2/3"
        >
            <Text
                className="text-gray-500 text-sm leading-4 text-center"
            >
                {info}
            </Text>
        </View>
    );
};

export default Info;
