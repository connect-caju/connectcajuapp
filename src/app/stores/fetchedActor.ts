import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { dateLimits } from "../../helpers/dates";
import { validateActorData } from "../../helpers/validateActorData";
import Realm from "realm";
import { Address, Assets, Contact, Coordinates, ErrorType, IdDocument, Names } from "../../lib/types";






type ActorStore = {
  actorData: Actor;
  setActorData: (data: Actor) => void;
  updateActorField: (
    field: keyof Actor,
    value: string | number | Date | boolean | Coordinates | Assets,
  ) => void;
  resetActorForm: () => void;
  validateActorForm: () => boolean;
  // submitActorForm: (ealm: Realm, data: ActorSchema) => Promise<void>;
};

export const useActorStore = create<ActorStore>((set, get) => ({
  actorData: {
    isSprayingAgent: false,
    isNotSprayingAgent: false,
    surname: "",
    otherNames: "",
    gender: "",
    familySize: "",
    addressDistrict: "",
    addressProvince: "",
    addressAdminPost: "",
    addressVillage: "",
    birthDistrict: "",
    birthProvince: "",
    birthAdminPost: "",
    birthVillage: "",
    primaryPhone: "",
    secondaryPhone: "",
    // email: "",
    birthDate: new Date(),
    docNumber: "",
    docType: "",
    image: "",
    nuit: "",
    uaid: "",
    identifier: "",
    isGroupMember: false,
    isNotGroupMember: false,

    errors: {},
  },

  setActorData: (data) => set({ actorData: data }),
  updateActorField: (field, value) =>
    set((state) => ({
      actorData: {
        ...state.actorData,
        [field]: value,
      },
    })),
  resetActorForm: () =>
    set({
      actorData: {
        isSprayingAgent: false,
        isNotSprayingAgent: false,
        surname: "",
        otherNames: "",
        gender: "",
        familySize: "",
        addressDistrict: "",
        addressProvince: "",
        addressAdminPost: "",
        addressVillage: "",
        birthDistrict: "",
        birthProvince: "",
        birthAdminPost: "",
        birthVillage: "",
        primaryPhone: "",
        secondaryPhone: "",
        // email: "",
        birthDate: new Date(dateLimits.maximumDate),
        docNumber: "",
        docType: "",
        image: "",
        nuit: "",
        uaid: "",
        identifier: "",
        isGroupMember: false,
        isNotGroupMember: false,
        errors: {},
      },
    }),
  validateActorForm: () => {
    const actorData = get().actorData;
    const updateActorField = get().updateActorField;

    const result = validateActorData(actorData);
    if (Object.keys(result.errorMessages).length > 0) {
      updateActorField("errors", result.errorMessages);
      return false;
    }
    return result.isValid;
  },

  submitActorForm: async (realm: Realm, data: ActorSchema) => {
    // submit the formData to Realm
    
    realm.write(async () => {
      const newActor = await realm.create("Actor", {
        ...data,
      });

      console.log("saved actor:", JSON.stringify(newActor));
      
    });
  },
}));
