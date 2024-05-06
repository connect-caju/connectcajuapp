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


export const buildActorObject = (
  actorData: ActorFormDataTypes,
  userDetails: UserDetails,
) => {
  const {
    names,
    gender,
    familySize,
    birthDate,
    birthPlace,
    address,
    contact,
    idDocument,
  } = actorData;

  const uaid = generateUAID({
    names: names,
    birthDate: birthDate,
    birthPlace: birthPlace,
  });

  let identifier = generateUniqueNumber(address.district!, farmerTypes.farmer);

  const builtActorData = {
    _id: uuidv4(),
    names: {
      surname: capitalize(names.surname.trim()),
      otherNames: capitalize(names.otherNames.trim()),
    },
    uaid: uaid,
    identifier: identifier,
    gender: gender?.trim(),
    familySize: Number(familySize),
    birthDate: actorData?.birthDate,
    birthPlace: {
      province: birthPlace.province,
      district: birthPlace.district,
      adminPost: birthPlace.adminPost,
      village: birthPlace.village,
    },
    address: {
      province: address.province,
      district: address.district,
      adminPost: address.adminPost,
      village: address.village,
    },
    contact: {
      primaryPhone: contact.primaryPhone ? Number(contact.primaryPhone) : 0,
      secondaryPhone: contact?.secondaryPhone ? Number(contact?.secondaryPhone) : 0,
      // email: actorData?.email,
    },
    idDocument: {
      docType: idDocument?.docType,
      docNumber:
        idDocument?.docNumber,
      nuit: idDocument.nuit ? Number(idDocument.nuit) : 0,
    },
    assets: [
      {
        category: categories.farmer.category,
        subcategory: categories.farmer.subcategories.notSubcategorized,
        assetType: assetTypes.farmland,
        assets: [],
      },
    ],

    userDistrict: userDetails?.userDistrict,
    userProvince: userDetails?.userProvince,
    userId: userDetails.userId,
    userName: userDetails?.userName,
  };

  return builtActorData;
};
