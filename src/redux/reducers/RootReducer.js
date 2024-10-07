import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer";
import userReducer from ".//UserReducers";
import { REMOVE_USER_DATA } from "../../redux/actions/UserActions";
import roleReducer from "./RoleReducer";
import filterReducer from "./FilterReducer";

const appReducer = combineReducers({
  login: LoginReducer,
  user: userReducer,
  role: roleReducer,
  filter: filterReducer,
});

const RootReducer = (state, action) => {
  if (action.type === REMOVE_USER_DATA) {
    // for all keys defined in your persistConfig(s)
    localStorage.removeItem("persist:whoop");

    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default RootReducer;
