/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { View, Text } from "react-native";
import React from "react";
import {
    Center,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { resourceValidation } from "../../consts/resourceValidation";
import { errorMessages } from "../../consts/errorMessages";
import COLORS from "../../consts/colors";
import AwesomeAlert from "react-native-awesome-alerts";
import { useState } from "react";

const ValidationOptions = ({ resource, resourceType, customUserData, realm, alert, setAlert, handleModalVisible, handleInvalidationMessage, }) => {
    const [alertInfo, setAlertInfo] = useState({
        message: "",
        title: "",
        cancelText: "",
        confirmText: "",
        showCancelButton: false,
        showConfirmButton: false,
        validated: true,
    });

    const handleOnCancelPressed = () => {
        setAlert(false);
        setAlertInfo((prev) => ({
            ...prev,
            message: "",
            title: "",
            cancelText: "",
            confirmText: "",
            showCancelButton: false,
            showConfirmButton: false,
            validated: true,
        }));
    };

    const handleOnConfirmPressed = () => {
        if (alertInfo.validated) {
            validationAction(realm, resource?._id, resourceType, "validate");
        }
        else {
            validationAction(realm, resource?._id, resourceType, "invalidate");
        }
        setAlert(false);
        setAlertInfo((prev) => ({
            ...prev,
            message: "",
            title: "",
            cancelText: "",
            confirmText: "",
            showCancelButton: false,
            showConfirmButton: false,
            validated: false,
        }));
    };


    // take validation action (validating or invalidating)
    const validationAction = (realm, resourceId, resourceType, flag) => {
        realm.write(() => {
            const foundResource = realm.objectForPrimaryKey(
                `${resourceType}`,
                `${resourceId}`,
            );
            if (flag === "validate") {
                foundResource.status = resourceValidation.status.validated;
                foundResource.checkedBy = customUserData?.name;
                handleModalVisible(); // hide the resource details card
            } else if (flag === "invalidate") {
                foundResource.status = resourceValidation.status.invalidated;
                foundResource.checkedBy = customUserData?.name;
                handleInvalidationMessage(); // display the invalidation message textinput
            }
        });
    };

    const handleResourceValidationAlert = (flag) => {
        setAlert(true);
        if (flag === "invalidate") {
            setAlertInfo((prev) => ({
                ...prev,
                title: errorMessages.resourceInvalidation.title,
                message: errorMessages.resourceInvalidation.message,
                showCancelButton: errorMessages.resourceInvalidation.showCancelButton,
                showConfirmButton: errorMessages.resourceInvalidation.showConfirmButton,
                cancelText: errorMessages.resourceInvalidation.cancelText,
                confirmText: errorMessages.resourceInvalidation.confirmText,
                validated: false,
            }));
        }
        else if (flag === "validate") {
            setAlertInfo((prev) => ({
                ...prev,
                title: errorMessages.resourceValidation.title,
                message: errorMessages.resourceValidation.message,
                showCancelButton: errorMessages.resourceValidation.showCancelButton,
                showConfirmButton: errorMessages.resourceValidation.showConfirmButton,
                cancelText: errorMessages.resourceValidation.cancelText,
                confirmText: errorMessages.resourceValidation.confirmText,
                validated: true,
            }));
        }
    };


    return (
        <View
            style={{ 
                paddingVertical: 5, 
                justifyContent: "center", 
                flexDirection: "row", 
                backgroundColor: COLORS.fourth, 
            }}
            space={3}
        >
            <AwesomeAlert
                show={alert}
                titleStyle={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 5,
                    width: "100%",
                    textAlign: "center",
                }}
                messageStyle={{
                    fontSize: 16,
                    color: COLORS.grey,
                    fontFamily: "JosefinSans-Regular",
                    lineHeight: 20,
                    textAlign: "center",
                }}
                alertContainerStyle={{}}
                overlayStyle={{}}
                contentContainerStyle={{}}
                contentStyle={{}}
                cancelButtonStyle={{
                    marginRight: 15,
                }}
                cancelButtonTextStyle={{
                    fontSize: 18,
                    textAlign: "center",
                    fontFamily: "JosefinSans-Bold",
                }}
                confirmButtonStyle={{
                    marginLeft: 15,
                }}
                confirmButtonTextStyle={{
                    fontSize: 18,
                    textAlign: "center",
                    fontFamily: "JosefinSans-Bold",
                }}
                showProgress={false}
                title={alertInfo.title}
                message={alertInfo.message}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={alertInfo.showCancelButton}
                showConfirmButton={alertInfo.showConfirmButton}
                cancelText={alertInfo.cancelText}
                confirmText={alertInfo.confirmText}
                cancelButtonColor={COLORS.danger}
                confirmButtonColor={COLORS.main}
                onCancelPressed={() => {
                    handleOnCancelPressed();
                    // handleModalVisible();
                }}
                onConfirmPressed={() => {
                    handleOnConfirmPressed();
                    // handleModalVisible();
                }}
            />

            <Center
                w="50%"
                style={{
                    // alignItems: "center",
                    padding: 5,
                }}
            >
                <TouchableOpacity
                    disabled={
                        resource?.status ===
                            (resourceValidation.status.pending)
                            ? false
                            : true
                    }
                    onPress={() => handleResourceValidationAlert("invalidate")}
                    style={{
                        // borderWidth: 1,
                        backgroundColor: COLORS.danger,
                        padding: 8,
                        minWidth: 135,
                        borderRadius: 8,
                    }}
                >
                    <Text
                        style={{
                            color:
                                resource?.status ===
                                    resourceValidation.status.validated
                                    ? COLORS.lightgrey
                                    : COLORS.white,
                            fontSize: 14,
                            fontFamily: "JosefinSans-Bold",
                            textAlign: "center",
                        }}
                    >
                        Indeferir Registo
                    </Text>
                </TouchableOpacity>
            </Center>
            <Center
                w="50%"
                style={{
                    padding: 5,
                }}
            >
                <TouchableOpacity
                    disabled={
                        resource?.status ===
                            (resourceValidation.status.pending)
                            ? false
                            : true
                    }
                    onPress={() => {
                        handleResourceValidationAlert("validate");
                    }}
                    style={{
                        // borderWidth: 1,
                        backgroundColor: COLORS.main,
                        padding: 8,
                        minWidth: 135,
                        borderRadius: 8,
                    }}
                >
                    <Text
                        style={{
                            color:
                                resource.status ===
                                    resourceValidation.status.validated
                                    ? COLORS.lightgrey
                                    : COLORS.white,
                            fontSize: 14,
                            fontFamily: "JosefinSans-Bold",
                            textAlign: "center",
                        }}
                    >
                        Deferir Registo
                    </Text>
                </TouchableOpacity>
            </Center>
        </View>
    );
};

export default ValidationOptions;
