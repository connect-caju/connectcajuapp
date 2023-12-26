/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Modal } from "react-native-paper";
import tailwind from "twrnc";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheckCircle, faCircleDot, faDotCircle } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faCheckDouble, faCircle, faRadio } from "@fortawesome/free-solid-svg-icons";
import COLORS from "../../consts/colors";

const AppearanceMode = ({
    isAppearanceModeModalVisible, setIsAppearanceModeModalVisible,
    colorScheme, toggleColorScheme, themeMode, setThemeMode,

}) => {

    useEffect(() => {
        setThemeMode(colorScheme);
    }, [colorScheme]);

    return (
        <Modal
            visible={isAppearanceModeModalVisible}
            contentContainerStyle={tailwind`flex-1 justify-center items-center`}
        >
            <View className="max-w-100 w-64 h-64 p-5 rounded-xl justify-center bg-white dark:bg-gray-800">
                <Text className="text-left text-gray-600 font-bold text-lg">Escolha Fundo</Text>

                <View className="flex flex-col gap-3 mt-2">
                    {themeMode === "light" ?
                        (<TouchableOpacity className="flex flex-row mb-2">
                            <View
                                className="w-6 h-6 rounded-full border-2 border-green-700"
                            >
                                <View className="w-3 h-3 m-auto rounded-full border-2 bg-green-700 border-green-700" />
                            </View>
                            <Text className="ml-6 text-sm font-normal text-gray-600">Branco</Text>
                        </TouchableOpacity>)
                        : (<TouchableOpacity
                            onPress={() => {
                                if (themeMode === "dark") {
                                    setThemeMode("light");
                                }
                            }}
                            className="flex flex-row mb-2"
                        >
                            <View
                                className="w-6 h-6 rounded-full border-2 border-gray-500"
                            />

                            <Text className="ml-6 text-sm font-normal text-gray-600">Branco</Text>
                        </TouchableOpacity>)
                    }
                </View>
                <View className="flex flex-col gap-3 mt-2">
                    {themeMode === "dark" ?
                        (<TouchableOpacity className="flex flex-row mb-2">
                            <View
                                className="w-6 h-6 rounded-full border-2 border-green-700"
                            >
                                <View className="w-3 h-3 m-auto rounded-full border-2 bg-green-700 border-green-700" />
                            </View>
                            <Text className="ml-6 text-sm font-normal text-gray-600">Escuro</Text>
                        </TouchableOpacity>)
                        : (<TouchableOpacity
                            onPress={() => {
                                if (themeMode === "light") {
                                    setThemeMode("dark");
                                }
                            }}
                            className="flex flex-row mb-2"
                        >
                            <View
                                className="w-6 h-6 rounded-full border-2 border-gray-500"
                            />

                            <Text className="ml-6 text-sm font-normal text-gray-600">Escuro</Text>
                        </TouchableOpacity>)
                    }
                </View>

                <View className="flex flex-row self-end flex-1 items-end">
                    <Pressable
                        onPress={() => {
                            setIsAppearanceModeModalVisible(false);
                        }}
                        className="mr-3"
                    >
                        <Text className="text-green-700 text-lg font-semibold">Cancelar</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            if (themeMode !== colorScheme){
                                toggleColorScheme();
                            }
                            setIsAppearanceModeModalVisible(false);
                        }}
                        className="ml-3"
                    >
                        <Text className="text-green-700 text-lg font-semibold">OK</Text>
                    </Pressable>
                </View>

            </View>
        </Modal>
    );
};

export default AppearanceMode;
