/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { create } from "twrnc";

// @ts-expect-error TS(2591): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const tw = create(require("../../tailwind.config"));

export default tw;
