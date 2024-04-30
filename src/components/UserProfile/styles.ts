import { StyleSheet } from "react-native"
import COLORS from "../../consts/colors"

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.lightestgrey,
    paddingTop: 10,
  },
  images: {
    width: 150,
    height: 150,
    borderColor: COLORS.main,
    borderWidth: 2,
    marginHorizontal: 3,
    borderRadius: 120,
  },
})

export default styles;
