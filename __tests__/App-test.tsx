/**
 * @format
 */

import "react-native";
import React from "react";

// @ts-expect-error TS(2307): Cannot find module '../App' or its corresponding t... Remove this comment to see the full error message
import App from "../src/app";

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("renders correctly", () => {
  renderer.create(<App />);
});
