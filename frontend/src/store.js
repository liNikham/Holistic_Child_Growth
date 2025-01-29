import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";  // This uses localStorage

// Persist configuration
const persistConfig = {
  key: "root",  // The key for your storage
  storage,      // Which storage to use (localStorage in this case)
  whitelist: ["user"], // Only persist the 'user' slice
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,  // Persist the user slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],  // Ignore non-serializable actions
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
