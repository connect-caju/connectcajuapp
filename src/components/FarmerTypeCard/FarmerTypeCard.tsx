/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Icon } from "@rneui/themed";

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, Text, TouchableOpacity } from "react-native";
import COLORS from "../../consts/colors";

export function FarmerTypeCard({
  route,
  item,
  pop
}: any) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      disabled={pop}
      onPress={() => {

        // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        navigation.navigate("FarmersListLayout", {
          farmerType: item?.farmerType,
        });
      }}
      style={{
        // alignItems: "center",
        // justifyContent: "center",
        // width: "100%",
      }}
      className="justify-center items-center"
    >
      <View
        style={{
          marginVertical: 20,
          paddingHorizontal: 5,
          flexDirection: "row",
          paddingVertical: 5,
          width: "100%",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "25%",
          }}
        >
          <View
            style={{
              borderRadius: 100,
              // borderWidth: 1,
              borderColor: item?.iconColor,
              // backgroundColor: COLORS.fourth,
              padding: 10,
              elevation: 8,
              display: pop ? "none" : "flex",
            }}
            className="bg-[#EBEBE4] dark:bg-gray-800"
          >
            <FontAwesomeIcon
              icon={item?.icon}
              size={40}
              color={item?.iconColor}
            />
          </View>
        </View>

        <View
          style={{
            padding: 5,
            width: "75%",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              paddingRight: 5,
            }}
          >
            <View
              style={{
                width: "85%",
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "JosefinSans-Bold",
                  textAlign: "right",
                  color: !pop ? item?.color : COLORS.lightgrey,
                }}
                numberOfLines={2}
                ellipsizeMode={"tail"}
              >
                {!pop && item.title}
              </Text>

              <Text
                style={{
                  // fontSize: 14,
                  // fontFamily: "JosefinSans-Italic",
                  // textAlign: "left",
                  // color: COLORS.grey,
                }}
                className="text-gray-600 text-left italic font-normal text-sm"
                numberOfLines={2}
                ellipsizeMode={"tail"}
              >
                {!pop && <>
                  ({Intl.NumberFormat().format(item?.total)}){" "}
                  {item?.description}
                </>
                }
              </Text>
            </View>

            <View
              style={{
                width: "15%",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              {!pop && <Icon name="arrow-forward-ios" size={25} color={COLORS.grey} />}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default FarmerTypeCard;
