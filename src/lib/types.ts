import { Realm } from "@realm/react";

export type CoopFormDataTypes = {
  isActive: "Sim" | "Não" | undefined;
  type: string;
  name: string;
  creationYear?: number;
  affiliationYear?: number;
  legalStatus?: string;
  purposes: string[];
  address: Address;
  numberOfMembers: Members;
  licence?: string;
  nuel?: number;
  nuit?: number;

  errors: ErrorType;
};

export type ActorFormDataTypes = {
  isSprayingAgent: "Sim" | "Não" | undefined;
  names: Names;
  gender: "Masculino" | "Feminino" | "Outro" | undefined;
  familySize: number | undefined;
  address: Address;
  birthPlace: Address;
  contact: Contact;
  birthDate: Date;
  idDocument: IdDocument;
  isGroupMember: "Sim" | "Não" | undefined;
  errors: ErrorType;
};

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



export interface RealmActorObject {
  _id: string;
  names: Names;
  uaid: string;
  identifier: string;
  gender: "Masculino" | "Feminino" | "Outro" | undefined;
  familySize: number;
  birthDate: Date;
  birthPlace: Address;
  address: Address;
  geolocation?: Coordinates;
  assets?: Assets[];
  contact?: Contact;
  idDocument?: IdDocument;
  image: string;
  userDistrict?: string;
  userProvince?: string;
  userId?: string;
  userName?: string;
  status: string;
  checkedBy?: string;
  createdAt: Date;
  modifiedAt: Date;
  modifiedBy?: string;
}

export type ActorType = Realm.Object & RealmActorObject;

export type Assets = {
  category?: string;
  subcategory?: string;
  assetType: string;
  assets: string[];
};

export type Names = {
  surname: string;
  otherNames: string;
};
export type Address = {
  province: string;
  district?: string;
  adminPost?: string;
  village?: string;
};

export type Contact = {
  primaryPhone?: number;
  secondaryPhone?: number;
  email?: string;
};

export type IdDocument = {
  docType?: string;
  docNumber?: string;
  nuit?: number;
};

export type ErrorType = {
  [key: string]: string;
};

export type Coordinates = {
  position?: number;
  latitude?: number;
  longitude?: number;
};

export type Manager = {
  fullname: string;
  phone?: number;
};

export type UserDetails = {
  userProvince?: string;
  userDistrict?: string;
  userId: string;
  userName?: string;
};

export type Members = {
  total: number;
  women: number;
}


type PartialUserDetails = Partial<UserDetails>
type PartialActorDetails = Partial<RealmActorObject>
type PartialInstitionDetails = Partial<InstitutionFormDataTypes>

export type CombinedPartialsUserActor = PartialActorDetails & PartialUserDetails;
export type CombinedPartialsUserInstitution = PartialInstitionDetails & PartialUserDetails;

export type FarmerType = {
  [key: string] : "Indivíduo" | "Grupo" | "Instituição"
}

