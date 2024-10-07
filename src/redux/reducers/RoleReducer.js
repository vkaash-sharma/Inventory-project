import { SET_ROLE } from "../../redux/actions/RoleAction";

const initialState = {
  role: "", // Initialize the role as empty string
};

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROLE:
      return {
        ...state,
        role: action.role,
      };
    default:
      return state;
  }
};

export default roleReducer;
