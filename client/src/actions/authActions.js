import { TEST_DISPATCH } from "./types";
//Register user
export const registerUser = user => {
  return {
    type: TEST_DISPATCH,
    payload: user
  };
};
