import {
  SET_USER_DATA,
  REMOVE_USER_DATA,
  USER_LOGGED_OUT,
} from "../actions/UserActions";

const initialState = {
  user: null,
};

const userReducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_DATA: {
      return {
        ...state,
        user: action.data,
      };
    }
    case REMOVE_USER_DATA: {
      return null;
    }
    case USER_LOGGED_OUT: {
      return null;
    }
    default: {
      return state;
    }
  }
};

export default userReducer;
