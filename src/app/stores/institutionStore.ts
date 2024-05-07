import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import Realm from "realm";
import {
  Address,
  Assets,
  Coordinates,
  ErrorType,
  Manager,
  UserDetails,
} from "../../lib/types";
import { generateUAID } from "../../helpers/generateUAID";
import { buildActorObject } from "../../helpers/buildActorObject";
import { validateInstitutionData } from "../../helpers/validateInstitutionData";
import { buildInstitutionObject } from "../../helpers/buildInstitutionObject";

export type InstitutionFormDataTypes = {
  isPrivate: "Sim" | "Não" | undefined;
  type: string;
  name: string;
  address: Address;
  manager: Manager;
  nuit?: number;
  licence?: string;

  errors: ErrorType;
};

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

const initialFormState = {
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
    // saving the actor to the Realm

    const builtInstitutionData = buildInstitutionObject(institutionData, userDatails);

    // 1. generating the uaid (unique actor identifier)

    // 2. saving the actor data to the Realm
    realm.write(async () => {
      const newActor = await realm.create("Institution", builtInstitutionData);

      // 3. accessing the savedActor data for further use in the component
      callback(newActor);
    });

    // // 4. in case this actor is a spraying services provider
    // if (get().institutionData.isSprayingAgent) {
    //   const sprayerAgentObject = {
    //     _id: uuidv4(),
    //   };
    // }

    // // 5. in case this actor is a member of an organization
    // if (get().institutionData.isGroupMember) {
    // }
  },
}));
