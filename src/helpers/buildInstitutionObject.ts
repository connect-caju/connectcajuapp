import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { ActorFormDataTypes } from "../app/stores/actorStore";
import { assetTypes } from "../consts/assetTypes";
import categories from "../consts/categories";
import { capitalize } from "./capitalize";
import { generateUAID } from "./generateUAID";
import { generateUniqueNumber } from "./generateUniqueNumber";
import { farmerTypes } from "../consts/farmerTypes";
import { UserDetails } from "../lib/types";
import { InstitutionFormDataTypes } from "../app/stores/institutionStore";
import InstitutionData from "../components/InstitutionData/InstitutionData";

export const buildInstitutionObject = (
  institutionData: InstitutionFormDataTypes,
  userDetails: UserDetails,
) => {
  const { isPrivate, type, name, manager, address, nuit, licence } =
    institutionData;

  let identifier = generateUniqueNumber(
    address.district!,
    farmerTypes.institution,
  );

  const builtInstitutionData = {
    _id: uuidv4(),
    private: isPrivate === "Sim" ? true : false,
    name: name
      .split(" ")
      .map((word) => capitalize(word))
      .join(" "),
    identifier: identifier,
    type,
    address: {
      province: address.province,
      district: address.district,
      adminPost: address.adminPost,
      village: address.village,
    },
    manager: {
      fullname: capitalize(manager.fullname),
      phone: manager?.phone ? Number(manager?.phone) : 0,
    },
    assets: [
      {
        category: categories.farmer.category,
        subcategory: categories.farmer.subcategories.notSubcategorized,
        assetType: assetTypes.farmland,
        assets: [],
      },
    ],
    nuit: nuit ? Number(nuit) : 0,
    licence,

    userDistrict: userDetails?.userDistrict,
    userProvince: userDetails?.userProvince,
    userId: userDetails.userId,
    userName: userDetails?.userName,
  };

  return builtInstitutionData;
};
