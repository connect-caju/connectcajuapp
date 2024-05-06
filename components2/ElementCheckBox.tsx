import { Pressable, Text, View } from "react-native";
import { Icon, } from "@rneui/themed";
import COLORS from "../src/consts/colors";
import { useColorScheme } from "nativewind";

type CheckboxProps = {
  onPress: () => void;
  checked: boolean;
  errorProperty?: string;
  title?: string;

};

/**
 * React Native checkbox component built with Tailwind CSS
 */
export const ElementCheckBox = ({ onPress, checked, errorProperty, title }: CheckboxProps) => {
  // const handleToggle = () => {
  //   onChange(!checked);
  // };
  const { colorScheme } = useColorScheme();


  return (
    <View>

    <Pressable
className="flex flex-row space-x-2 border border-black"
onPress={onPress}
// role="checkbox"
>
      {checked ? (
        <Icon name="check-box" color={COLORS.main} size={35} iconStyle={{}} />
      ) : <Icon
      name="crop-square"
      color={!!errorProperty ? COLORS.red : colorScheme === "dark" ? COLORS.white : COLORS.black}
      size={35}
      iconStyle={{}}
      />}
    </Pressable>
    <Text>{title}</Text>
      </View>
  );
};
