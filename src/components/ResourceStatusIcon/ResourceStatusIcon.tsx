/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { View, Text } from "react-native";
import React from "react";
import COLORS from "../../consts/colors";
import { resourceValidation } from "../../consts/resourceValidation";
import { Icon } from "@rneui/base";

const ResourceStatusIcon = ({ resource }) => {
    return (
        <View
            style={{
                justifyContent: "space-around",
                alignItems: "center",
                // position: "absolute",
                // top: 4,
                // right: 4,
                // zIndex: 1,
                flexDirection: "row",
                borderColor:
                    resource?.status === resourceValidation.status.pending
                        ? COLORS.danger
                        : resource?.status === resourceValidation.status.validated
                            ? COLORS.main
                            : COLORS.red,
                borderWidth: 2,
                borderRadius: 10,
            }}
        >
            <Icon
                name={
                    resource?.status === resourceValidation.status.pending
                        ? "pending-actions"
                        : resource?.status === resourceValidation.status.validated
                            ? "check-circle"
                            : "dangerous"
                }
                size={20}
                color={
                    resource?.status === resourceValidation.status.pending
                        ? COLORS.danger
                        : resource?.status === resourceValidation.status.validated
                            ? COLORS.main
                            : COLORS.red
                }
            />
            <Text
                style={{
                    fontSize: 10,
                    paddingLeft: 5,
                    color:
                        resource?.status === resourceValidation.status.pending
                            ? COLORS.danger
                            : resource?.status === resourceValidation.status.validated
                                ? COLORS.main
                                : COLORS.red,
                }}
            >
                {resource?.status === resourceValidation.status.pending
                    ? resourceValidation.message.pendingResourceMessage
                    : resource?.status === resourceValidation.status.validated
                        ? resourceValidation.message.validatedResourceMessage
                        : resourceValidation.message.invalidatedResourceMessage}
            </Text>
        </View>
    );
};

export default ResourceStatusIcon;
