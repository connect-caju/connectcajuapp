import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { assetTypes } from "../consts/assetTypes";
import categories from "../consts/categories";
import { capitalize } from "./capitalize";
import { generateUniqueNumber } from "./generateUniqueNumber";
import { farmerTypes } from "../consts/farmerTypes";
import { InstitutionFormDataTypes, UserDetails } from "../lib/types";

export const buildInstitutionObject = (
  institutionData: InstitutionFormDataTypes,
  userDetails: UserDetails,
) => {
  const { isPrivate, type, name, manager, address, nuit, licence } =
    institutionData;

  let identifier = generateUniqueNumber(
    userDetails.userDistrict!,
    farmerTypes.institution,
  );

  const builtInstitutionData = {
    _id: uuidv4(),
    private: isPrivate === "Sim" ? true : false,
    name: capitalize(name),
    identifier: identifier,
    type,
    address: {
      province: userDetails.userDistrict,
      district: userDetails.userDistrict,
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
