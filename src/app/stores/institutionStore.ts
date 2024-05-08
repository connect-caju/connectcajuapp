import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import Realm from "realm";
import {
  Address,
  Assets,
  Coordinates,
  ErrorType,
  InstitutionFormDataTypes,
  Manager,
  UserDetails,
} from "../../lib/types";
import { validateInstitutionData } from "../../helpers/validateInstitutionData";
import { buildInstitutionObject } from "../../helpers/buildInstitutionObject";


type InstitutionFormStore = {
  institutionData: InstitutionFormDataTypes;
  setInstitutionData: (data: InstitutionFormDataTypes) => void;
  updateInstitutionField: (
    field: keyof InstitutionFormDataTypes,
    value:
      | string
      | number
      | ErrorType
      | Address
      | Manager
  ) => void;
  resetInstitutionForm: () => void;
  validateInstitutionForm: () => boolean;
  submitInstitutionForm: (
    realm: Realm,
    institutionData: InstitutionFormDataTypes,
    userDetails: UserDetails,
    callback: (object: Realm.Object) => void,
  ) => Promise<void>;
};

const initialFormState : InstitutionFormDataTypes = {
  isPrivate: undefined,
  type: "",
  name: "",
  address: {
    province: "",
    district: "",
    adminPost: "",
    village: "",
  },
  manager: {
    fullname: "",
    phone: undefined,
  },
  nuit: undefined,
  licence: "",
  errors: {},
};

export const useInstitutionStore = create<InstitutionFormStore>((set, get) => ({
  institutionData: initialFormState,

  setInstitutionData: (data) => set({ institutionData: data }),
  updateInstitutionField: (field, value) =>
    set((state) => ({
      institutionData: {
        ...state.institutionData,
        [field]: value,
      },
    })),
  resetInstitutionForm: () =>
    set({
      institutionData: initialFormState,
    }),
  validateInstitutionForm: () => {
    const institutionData = get().institutionData;
    const updateInstitutionField = get().updateInstitutionField;
    const result = validateInstitutionData(institutionData);
    if (Object.keys(result.errorMessages).length > 0) {
      updateInstitutionField("errors", result.errorMessages);
      return false;
    }
    return result.isValid;
  },

  submitInstitutionForm: async (
    realm: Realm,
    institutionData: InstitutionFormDataTypes,
    userDatails: UserDetails,
    callback: (actor: Realm.Object) => void,
  ) => {
    // get the formatted data
    const builtInstitutionData = buildInstitutionObject(institutionData, userDatails);

    // 1. save the institution data to the Realm
    realm.write(async () => {
      const newActor = await realm.create("Institution", builtInstitutionData);
      callback(newActor);
    });

  },
}));
