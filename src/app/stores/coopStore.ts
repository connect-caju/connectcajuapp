import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import Realm from "realm";
import {
  Address,
  CoopFormDataTypes,
  ErrorType,
  Members,
  UserDetails,
} from "../../lib/types";
import { validateCoopData } from "../../helpers/validateCoopData";
import { buildCoopObject } from "../../helpers/buildCoopObject";


type CoopFormStore = {
  coopData: CoopFormDataTypes;
  setCoopData: (data: CoopFormDataTypes) => void;
  updateCoopField: (
    field: keyof CoopFormDataTypes,
    value:
      | string
      | number
      | Date
      | boolean
      | ErrorType
      | Members
      | Address
      | string[]
  ) => void;
  resetCoopForm: () => void;
  validateCoopForm: () => boolean;
  submitCoopForm: (
    realm: Realm,
    coopData: CoopFormDataTypes,
    userDetails: UserDetails,
    callback: (object: Realm.Object) => void,
  ) => Promise<void>;
};

const initialFormState: CoopFormDataTypes = {
  isActive: undefined,
  type: "",
  name: "",
  creationYear: 0,
  affiliationYear: 0,
  legalStatus: "",
  purposes: [],
  address: {
    province: "",
    district: "",
    adminPost: "",
    village: "",
  },
  numberOfMembers: {
    total: 0,
    women: 0,
  },
  nuel: undefined,
  nuit: undefined,
  licence: "",
  errors: {},
};

export const useCoopStore = create<CoopFormStore>((set, get) => ({
  coopData: initialFormState,

  setCoopData: (data) => set({ coopData: data }),
  updateCoopField: (field, value) =>
    set((state) => ({
      coopData: {
        ...state.coopData,
        [field]: value,
      },
    })),
  resetCoopForm: () =>
    set({
      coopData: initialFormState,
    }),
  validateCoopForm: () => {
    const coopData = get().coopData;
    const updateCoopField = get().updateCoopField;
    const result = validateCoopData(coopData);
    if (Object.keys(result.errorMessages).length > 0) {
      updateCoopField("errors", result.errorMessages);
      return false;
    }
    return result.isValid;
  },

  submitCoopForm: async (
    realm: Realm,
    coopData: CoopFormDataTypes,
    userDatails: UserDetails,
    callback: (actor: Realm.Object) => void,
  ) => {
    // saving the actor to the Realm


    const builtCoopData = buildCoopObject(coopData, userDatails);

    // 1. generating the uaid (unique actor identifier)

    // 2. saving the actor data to the Realm
    realm.write(async () => {
      const newCoop = await realm.create("Group", builtCoopData);

      // 3. accessing the savedActor data for further use in the component
      callback(newCoop);
    });

    // // 4. in case this actor is a spraying services provider
    // if (get().coopData.isSprayingAgent) {
    //   const sprayerAgentObject = {
    //     _id: uuidv4(),
    //   };
    // }

    // // 5. in case this actor is a member of an organization
    // if (get().coopData.isGroupMember) {
    // }



  },
}));
