/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, Text } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import COLORS from "../../consts/colors";
import { Icon } from "@rneui/base";

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { TouchableOpacity } from "react-native";

const InternetInfo = ({
    isNetInfoVisible,
    setIsNetInfoVisible
}: any) => {
    return (
        <Modal
            isVisible={isNetInfoVisible}
            supportedOrientations={["portrait", "landscape"]}
            propagateSwipe
            animationIn={"zoomIn"}
            animationInTiming={600}
            animationOut={"zoomOut"}

            hideModalContentWhileAnimating={true}
            swipeThreshold={1000}
        >
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        backgroundColor: COLORS.ghostwhite,
                        height: "50%",
                        width: "50%",
                    }}
                >
                    <Text>InternetInfo</Text>
                    <TouchableOpacity
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                        onPress={()=>setIsNetInfoVisible(false)}
                    >
                        <Icon name="close" size={40} color={COLORS.grey} />
                    </TouchableOpacity>
                </View>

            </View>

        </Modal>
    );
};

export default InternetInfo;
