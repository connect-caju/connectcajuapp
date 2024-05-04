import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

type ActorFormData = {
  isSprayerAgent: boolean;
  isNotSprayingAgent: boolean;
  surname: string;
  otherNames: string;
  gender: string;
  familySize: string;
  addressVillage?: string;
  addressAdminPost?: string;
  addressDistrict: string;
  addressProvince: string;
  birthVillage?: string;
  birthAdminPost?: string;
  birthDistrict: string;
  birthProvince: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  // email?: string;
  birthDate: Date;
  docType?: string;
  docNumber?: string;
  nuit?: string;
  image?: string;
  uaid: string;
  identifier?: string;
};

type ActorFormStore = {
  actorData: ActorFormData;
  setActorData: (data: ActorFormData) => void;
  updateActorField: (
    field: keyof ActorFormData,
    value: string | number | Date,
  ) => void;
  resetActorForm: () => void;
  validateActorForm: () => boolean;
  submitActorForm: () => Promise<void>;
};

export const useActorStore = create<ActorFormStore>((set, get) => ({
  actorData: {
    isSprayerAgent: false,
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
  },
  setActorData: (data) => set({ actorData: data }),
  updateActorField: (field, value) => set((state) => ({})),
  resetActorForm: () =>
    set({
      actorData: {
        isSprayerAgent: false,
        isNotSprayingAgent: false,
        surname: "",
        otherNames: "",
        gender: "",
        familySize: '',
        addressDistrict: "",
        addressProvince: "",
        addressAdminPost: "",
        addressVillage: "",
        birthDistrict: "",
        birthProvince: "",
        birthAdminPost: "",
        birthVillage: "",
        primaryPhone: '',
        secondaryPhone: '',
        // email: "",
        birthDate: new Date(),
        docNumber: "",
        docType: "",
        image: "",
        nuit: '',
        uaid: "",
        identifier: "",
      },
    }),
  validateActorForm: () => {
    const actorData = get().actorData;

    return true;
  },
  submitActorForm: async () => {
    const actorData = get().actorData;
    const isValid = get().validateActorForm();
    if (isValid) {
      try {
      } catch (error) {
        console.log(error);
      }
    }
  },
}));
