/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import {
    View,
    TouchableOpacity,
    TextInput,
} from "react-native";
import {
    Box,
    FormControl,
} from "native-base";
import React, { useState, useCallback } from "react";
import { Icon } from "@rneui/base";
import COLORS from "../../consts/colors";
import { v4 as uuidv4 } from "uuid";
import validateInvalidationMessage from "../../helpers/validateInvalidationMessage";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import { useEffect } from "react";
import { Text } from "react-native";
import { resourceValidation } from "../../consts/resourceValidation";
import { roles } from "../../consts/roles";
import { errorMessages } from "../../consts/errorMessages";
import CustomDivider from "../Divider/CustomDivider";
const { useRealm, useQuery, useObject } = realmContext;

const InvalidationMessage = ({ resource, resourceType, }) => {
    const realm = useRealm();
    const user = useUser();
    const customUserData = user?.customData;
    const invalidationMotives = realm
        .objects("InvalidationMotive")
        .filtered(`resourceId == "${resource?._id}"`);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");


    const addMessage = useCallback(
        (realm, newResourceId, newMessage) => {
            if (!validateInvalidationMessage(newMessage, errors, setErrors)) {
                return;
            }

            const validatedMessage = validateInvalidationMessage(
                newMessage,
                errors,
                setErrors,
            );

            const invalidationMotive = realm
                .objects("InvalidationMotive")
                .filtered(`resourceId == "${newResourceId}"`);
            const newMessageObject = {
                position:
                    invalidationMotive[0] && invalidationMotive[0]?.messages?.length > 0
                        ? invalidationMotive[0]?.messages?.length + 1
                        : 0,
                message: validatedMessage,
                ownerName: customUserData?.name,
                createdAt: new Date(),
            };

            if (invalidationMotive?.length > 0) {
                realm.write(() => {
                    invalidationMotive[0].messages.push(newMessageObject);
                });
            } else {
                realm.write(async () => {
                    const newResourceMessage = await realm.create("InvalidationMotive", {
                        _id: uuidv4(),
                        resourceId: resource?._id,
                        resourceName: `${resourceType}`,
                        messages: [newMessageObject],
                        createdAt: new Date(),
                    });
                });
            }
        },
        [realm, customUserData, message],
    );

    useEffect(() => {
        realm.subscriptions.update((mutableSubs) => {
            mutableSubs.add(
                realm
                    .objects("InvalidationMotive")
                    .filtered(`resourceId == "${resource._id}"`),
            );
        });
    }, [
        realm,
        user,
        message,
        invalidationMotives,
    ]);


    return (
        <View style={{
        }}>
            {resource?.status === resourceValidation.status.invalidated && (
                <>
                    {roles.haveReadAndWritePermissions.some(role => role === customUserData?.role) && (
                        <Text
                            style={{
                                textAlign: "left",
                                color: COLORS.red,
                                fontSize: 14,
                                fontFamily: "JosefinSans-Bold",
                            }}
                        >
                            Motivo de indeferimento
                        </Text>
                    )}
                    {invalidationMotives?.length > 0 ? (
                        invalidationMotives?.length > 0 &&
                        invalidationMotives[0]?.messages?.length > 0 &&
                        invalidationMotives[0]?.messages?.map((motive, index) => (
                            <View key={index}
                                style={{
                                    marginHorizontal: 5,
                                    maxWidth: "80%",
                                    minWidth: "0%",
                                    alignSelf: roles.haveReadAndWritePermissions.some(role => role === customUserData.role) ? "flex-start" : "flex-end",
                                }}
                            >

                                <Text
                                    style={{
                                        textAlign: "left",
                                        fontSize: 12,
                                        color: COLORS.grey,
                                        marginBottom: -5,
                                        paddingLeft: 15,
                                    }}
                                >
                                    {motive?.ownerName.split(" ")[0]}
                                </Text>
                                <Box
                                    style={{
                                        backgroundColor: COLORS.main,
                                        borderRadius: 30,
                                        borderBottomRightRadius: roles.haveReadAndWritePermissions.some(role => role === customUserData.role) ? 30 : 0,
                                        borderBottomLeftRadius: roles.haveReadAndWritePermissions.some(role => role === customUserData.role) ? 0 : 30,
                                        paddingHorizontal: 15,
                                        paddingVertical: 10,
                                        margin: 5,
                                        maxWidth: "80%",
                                        minWidth: "20%",
                                        alignSelf: "flex-end",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontFamily: "JosefinSans-Regular",
                                            color: COLORS.white,
                                            textAlign: "left",
                                            lineHeight: 18,
                                        }}
                                    >
                                        {motive.message
                                            ? motive.message
                                            : "Dados incompletos."}
                                    </Text>
                                </Box>
                                <Text
                                    style={{
                                        textAlign: "right",
                                        fontSize: 10,
                                        color: COLORS.grey,
                                        marginTop: -5,
                                        paddingBottom: 10,
                                    }}
                                >
                                    {new Date(motive?.createdAt).getDate()}/
                                    {new Date(motive?.createdAt).getMonth() + 1}/
                                    {new Date(motive?.createdAt).getFullYear()}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Box
                            style={{
                                margin: 5,
                                maxWidth: "80%",
                                minWidth: "10%",
                                alignSelf: "flex-end",
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: "left",
                                    fontSize: 12,
                                    color: COLORS.grey,
                                    marginBottom: -5,
                                    paddingLeft: 15,
                                }}
                            >
                                Gerado pelo Sistema Connect Caju
                            </Text>
                            <Box
                                style={{
                                    backgroundColor: COLORS.main,
                                    borderRadius: 30,
                                    borderBottomRightRadius: roles.haveReadAndWritePermissions.some(role => role === customUserData.role) ? 30 : 0,
                                    borderBottomLeftRadius: roles.haveReadAndWritePermissions.some(role => role === customUserData.role) ? 0 : 30,
                                    paddingHorizontal: 15,
                                    paddingVertical: 5,
                                    margin: 5,
                                    maxWidth: "80%",
                                    minWidth: "10%",
                                    alignSelf: "flex-end",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: "JosefinSans-Regular",
                                        color: COLORS.white,
                                        textAlign: "left",
                                        lineHeight: 18,
                                    }}
                                >
                                {errorMessages.automaticInvalidationMessage.invalidationMessage}    
                                </Text>
                            </Box>
                            <Text
                                style={{
                                    textAlign: "right",
                                    fontSize: 10,
                                    color: COLORS.grey,
                                    marginTop: -5,
                                    paddingBottom: 10,
                                }}
                            >
                                {new Date(resource?.createdAt).getDate()}/
                                {new Date(resource?.createdAt).getMonth() + 1}/
                                {new Date(resource?.createdAt).getFullYear()}
                            </Text>
                        </Box>
                    )}
                </>
            )}

            {roles.haveReadAndValidatePermissions.some(role => role === customUserData?.role) &&
                <View

                >
                    <CustomDivider />
                    <FormControl
                        isInvalid={"invalidationMessage" in errors}
                    >
                        <FormControl.Label>
                            Motivo de indeferimento
                        </FormControl.Label>
                        <TextInput
                            style={{
                                borderWidth: 0,
                                borderColor: COLORS.lightestgrey,
                                borderRadius: 20,
                                padding: 10,
                                paddingBottom: !message ? 0 : 40,
                                fontSize: 16,
                                backgroundColor: COLORS.textInputBgColor,
                            }}
                            placeholder={`Deixa uma mensagem para ${resource?.userName?.split(" ")[0]
                                }`}
                            multiline={true}
                            textAlignVertical="top"
                            numberOfLines={3}
                            maxLength={255}
                            value={message}
                            onChangeText={(newMessage) => {
                                setErrors({
                                    invalidationMessage: "",
                                });
                                setMessage(newMessage);
                            }}
                        />
                        {"invalidationMessage" in errors && (
                            <FormControl.ErrorMessage
                                leftIcon={
                                    <Icon
                                        name="error-outline"
                                        size={16}
                                        color="red"
                                    />
                                }
                                _text={{ fontSize: "xs" }}
                            >
                                {errors?.invalidationMessage}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    {message && (

                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                bottom: 8,
                                right: 8,
                                // padding: 5,
                                borderRadius: 100,
                                width: 40,
                                height: 40,
                                borderWidth: 1,
                                borderColor: COLORS.main,
                                backgroundColor: COLORS.main,
                                justifyContent: "center",
                                alignItems: "center",

                            }}

                            onPress={() => {
                                try {
                                    addMessage(realm, resource?._id, message);
                                } catch (error) {
                                    console.log(
                                        "Failed to add invalidation message",
                                    );
                                    return;
                                } finally {
                                    setMessage("");
                                }
                            }}
                        >
                            <Icon
                                name="send"
                                size={25}
                                color={COLORS.ghostwhite}
                                iconStyle={{
                                    transform: [{ rotate: "0deg" }],
                                }}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            }


        </View >
    );
};

export default InvalidationMessage;
