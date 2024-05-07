import { Realm } from "@realm/react";


export interface RealmActorObject {  _id: string;
  names: Names;
  uaid: string;
  identifier: string;
  gender: string;
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
};

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
  }

  export type Manager = {
    fullname: string;
    phone?: number;
  }
  

  export type UserDetails = {
    userProvince?: string;
    userDistrict?: string;
    userId: string;
    userName?: string;
}
