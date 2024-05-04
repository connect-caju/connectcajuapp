
import { View, Text, Animated } from "react-native";
import React, { useState } from "react";
import COLORS from "../../consts/colors";

const MenuFromEllipsis = ({
    menu,
    pop
}: any) => {


    return (
        <View
            style={{
                flex: 1,
                zIndex: 150,
            }}
            >
            <Animated.View
                style={[{
                    display: pop ? "flex" : "none",
                    width: 150,
                    height: 200,
                    backgroundColor: COLORS.grey,
                    position: "absolute",
                    top: 25,
                    // right: 
                }, { right: menu, zIndex: 1, }]}
            >
                <Text>MenuFromEllipsis</Text>
            </Animated.View>
        </View>
    );
};

export default MenuFromEllipsis;
