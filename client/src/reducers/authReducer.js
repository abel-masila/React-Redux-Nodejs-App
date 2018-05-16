import { TEST_DISPATCH } from "./../actions/types";
const initialState = {
  isAuthenticated: false,
  user: {}
};
export default (state = initialState, action) => {
  switch (action.type) {
    case TEST_DISPATCH:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
