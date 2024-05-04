import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { dateLimits } from "../../helpers/dates";
import { validateActorForm } from "../../helpers/validateActorForm";

type Assets = {
  category?: string;
  subcategory?: string;
  assetType: string;
  assets: string[];
};

type Names = {
  surname: string;
  otherNames: string;
};
type Address = {
  province: string;
  district?: string;
  adminPost?: string;
  village?: string;
};

type Contact = {
  primaryPhone?: number;
  secondaryPhone?: number;
  email?: string;
};

type IdDocument = {
  docType?: string;
  docNumber?: string;
  nuit?: number;
};

export type ActorSchema = {
  names: Names;
  uaid: string;
  identifier?: string;
  gender: string;
  familySize: number;
  birthDate: Date;
  birthPlace: Address;
  address: Address;
  contact: Contact;
  idDocument: IdDocument;
  image?: string;
  assets: Assets;

  userDistrict?: string;
  userProvince?: string;
  userId: string;
  userName?: string;
};

export type ErrorType = {
  [key: string]: string;
};

export type ActorFormData = {
  isSprayingAgent: boolean;
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
  isGroupMember: boolean;
  isNotGroupMember: boolean;

  errors: ErrorType;
};

type ActorFormStore = {
  actorData: ActorFormData;
  setActorData: (data: ActorFormData) => void;
  updateActorField: (
    field: keyof ActorFormData,
    value: string | number | Date | boolean | ErrorType,
  ) => void;
  resetActorForm: () => void;
  validateActorForm: () => boolean;
  submitActorForm: () => Promise<void>;
};

export const useActorStore = create<ActorFormStore>((set, get) => ({
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

    const result = validateActorForm(actorData);
    if (Object.keys(result.errorMessages).length > 0) {
      updateActorField("errors", result.errorMessages)
      return false;
    }
    return result.isValid;
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
