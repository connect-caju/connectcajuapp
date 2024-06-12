import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { dateLimits } from "../../helpers/dates";
import { validateActorData } from "../../helpers/validateActorData";
import Realm from "realm";
import {
  ActorFormDataTypes,
  Address,
  Assets,
  Contact,
  Coordinates,
  ErrorType,
  IdDocument,
  Names,
  UserDetails,
} from "../../lib/types";
import { generateUAID } from "../../helpers/generateUAID";
import { buildActorObject } from "../../helpers/buildActorObject";


type ActorFormStore = {
  actorData: ActorFormDataTypes;
  setActorData: (data: ActorFormDataTypes) => void;
  updateActorField: (
    field: keyof ActorFormDataTypes,
    value:
      | string
      | number
      | Date
      | boolean
      | ErrorType
      | Address
      | IdDocument
      | Names
      | Contact,
  ) => void;
  resetActorForm: () => void;
  validateActorForm: () => boolean;
  submitActorForm: (
    realm: Realm,
    actorData: ActorFormDataTypes,
    userDetails: UserDetails,
    callback: (object: Realm.Object) => void,
  ) => Promise<void>;
};

const initialFormState : ActorFormDataTypes = {
  isSprayingAgent: undefined,
  names: {
    surname: "",
    otherNames: "",
  },
  gender: undefined,
  familySize: undefined,
  address: {
    province: "",
    district: "",
    adminPost: "",
    village: "",
  },
  birthPlace: {
    province: "",
    district: "",
    adminPost: "",
    village: "",
  },
  birthDate: new Date(dateLimits.maximumDate),
  contact: {
    primaryPhone: undefined,
    secondaryPhone: undefined,
  },
  idDocument: {
    nuit: undefined,
    docNumber: "",
    docType: "",
  },
  isGroupMember: undefined,

  errors: {},
};

export const useActorStore = create<ActorFormStore>((set, get) => ({
  actorData: initialFormState,

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
      actorData: initialFormState,
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

  submitActorForm: async (
    realm: Realm,
    actorData: ActorFormDataTypes,
    userDatails: UserDetails,
    callback: (actor: Realm.Object) => void,
  ) => {
    // saving the actor to the Realm

    const builtActorData = buildActorObject(actorData, userDatails);

    // 1. generating the uaid (unique actor identifier)

    // 2. saving the actor data to the Realm
    realm.write(async () => {
      const newActor = await realm.create("Actor", builtActorData);

      // 3. accessing the savedActor data for further use in the component
      callback(newActor);
    });

    // // 4. in case this actor is a spraying services provider
    // if (get().actorData.isSprayingAgent) {
    //   const sprayerAgentObject = {
    //     _id: uuidv4(),
    //   };
    // }

    // // 5. in case this actor is a member of an organization
    // if (get().actorData.isGroupMember) {
    // }



  },
}));
