/**
 *  Farmer schema for each individual farmer that owns
 *  cashew farmland
 */

import { Realm } from "@realm/react"
import { ObjectSchema } from "realm"
import { ActorType, Address, Assets, Contact, Coordinates, IdDocument, Names } from "../lib/types";

export class Actor extends Realm.Object<ActorType> {
  _id!: string;
  names!: Names;
  uaid!: string;
  identifier?: string;
  gender!: string;
  familySize!: number;
  birthDate!: Date;
  birthPlace!: Address;
  address!: Address;
  geolocation?: Coordinates;
  assets!: Assets[];
  contact?: Contact;
  idDocument?: IdDocument;
  image!: string;
  userDistrict?: string;
  userProvice?: string;
  userId!: string;
  userName?: string;
  status!: string;
  checkedBy?: string;
  modifiedBy?: string;
  createdAt!: Date;
  modifiedAt!: Date;


  static schema: ObjectSchema = {
    name: "Actor",
    primaryKey: "_id",
    properties: {
      _id: "string",
      names: "Name",
      uaid: "string", //uaid: unique actor id  => <Firstname first 2 characters>.<birthDate in milliseconds>.<birthPlace CEP>.<Lastname first 2 characters>
      identifier: "string?",
      gender: "string",
      familySize: "int",
      birthDate: "date",
      birthPlace: "Address",
      address: "Address",
      geolocation: "Coordinates?",
      assets: "Assets[]",
      contact: "Contact?",
      idDocument: "IdDocument?",
      image: { type: "string", default: "" },

      // user info (user who creates data resource)
      userDistrict: "string?",
      userProvince: "string?",
      userId: "string",
      userName: "string?",

      // validation properties (pending, invalidated, validated)
      status: { type: "string", default: "pending" },
      checkedBy: "string?",

      // dates (creation and modification dates)
      createdAt: { type: "date", default: () => new Date() },
      modifiedAt: { type: "date", default: () => new Date() },
      modifiedBy: "string?",
    },
  }
};
