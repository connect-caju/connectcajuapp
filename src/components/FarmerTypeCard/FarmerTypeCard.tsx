
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Icon } from "@rneui/themed";
import { View, Text, TouchableOpacity } from "react-native";
import COLORS from "../../consts/colors";
import { cn } from "../../../lib/utils";

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
      className={cn("justify-center m-3 rounded-lg items-center bg-white dark:bg-black shadow-md shadow-[#008000]/50",
        {
          "shadow-none shadow-transparent": pop
        }
      )}
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
            className="bg-white border-4 dark:bg-gray-800"
          >
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
                  fontSize: 30,
                  fontFamily: "JosefinSans-Bold",
                  textAlign: "right",
                  // color: !pop ? item?.color : COLORS.lightgrey,
                }}
                className="text-black dark:text-white"
                numberOfLines={2}
                ellipsizeMode={"tail"}
              >
                {!pop && item.title}
              </Text>

              <Text
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
              {!pop && <Icon name="arrow-forward-ios" size={25} color={COLORS.main} />}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default FarmerTypeCard;
