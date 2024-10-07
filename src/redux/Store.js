import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import RootReducer from "./reducers/RootReducer";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "whoop",
  storage: storage,
};

const middlewares = [thunk];
const { logger } = require(`redux-logger`);

middlewares.push(logger);

let devtools = (x) => x;

// export const Store = createStore(
//   RootReducer,
//   // initialState,
//   compose(applyMiddleware(...middlewares), devtools)
// );

const persistedReducer = persistReducer(persistConfig, RootReducer);

export default () => {
  let store = createStore(
    persistedReducer,
    compose(applyMiddleware(...middlewares), devtools)
  );
  let persistor = persistStore(store);
  return { store, persistor };
};
