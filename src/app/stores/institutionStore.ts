import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { dateLimits } from "../../helpers/dates";
import { validateActorData } from "../../helpers/validateActorData";

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

export type InstitutionFormData = {
  type: string;
  private: boolean;
  name: string;
  managerFullname: string;
  managerPhone?: string;
  addressVillage?: string;
  addressAdminPost?: string;
  addressDistrict: string;
  addressProvince: string;
  nuit?: string;
  licence?: string;
  image?: string;

  errors: ErrorType;
};

type InstitutionFormStore = {
  institutionData: InstitutionFormData;
  setInstitutionData: (data: InstitutionFormData) => void;
  updateInstitutionField: (
    field: keyof InstitutionFormData,
    value: string | number | Date | boolean | ErrorType,
  ) => void;
  resetInstitutionForm: () => void;
  validateInstitutionForm: () => boolean;
  submitInstitutionForm: () => Promise<void>;
};

export const useInstitutionStore = create<InstitutionFormStore>((set, get) => ({
  institutionData: {
    type: "",
    private: false,
    name: "",
    managerFullname: "",
    managerPhone: "",
    addressDistrict: "",
    addressProvince: "",
    addressAdminPost: "",
    addressVillage: "",

    image: "",
    nuit: "",

    errors: {},
  },

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
      institutionData: {
        managerFullname: "",
        managerPhone: "",
        name: "",
        type: "",
        private: false,
        addressDistrict: "",
        addressProvince: "",
        addressAdminPost: "",
        addressVillage: "",
        image: "",
        nuit: "",

        errors: {},
      },
    }),
  validateInstitutionForm: () => {
    const institutionData = get().institutionData;
    const updateActorField = get().updateInstitutionField;

    // const result = validateInstitutionData(institutionData);
    // if (Object.keys(result.errorMessages).length > 0) {
    //   updateInstitutionField("errors", result.errorMessages);
    //   return false;
    // }
    // return result.isValid;
    return true;
  },

  submitInstitutionForm: async () => {
    const institutionData = get().institutionData;
    const isValid = get().validateInstitutionForm();
    if (isValid) {
      try {
      } catch (error) {
        console.log(error);
      }
    }
  },
}));
