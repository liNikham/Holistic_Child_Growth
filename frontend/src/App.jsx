import React from "react";
import AppRouter from "./router";
import { useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
import { persistStore } from "redux-persist"; // Import persistStore
import { store } from "./store"; // Your store file
import { signInSuccess } from "./features/userSlice";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';

const App = () => {
  const dispatch = useDispatch();
  const persistor = persistStore(store); // Create persistor

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch(signInSuccess(user));  // Set user in Redux
    }
  }, [dispatch]);

  return (
    <I18nextProvider i18n={i18n}>
      <PersistGate loading={null} persistor={persistor}> {/* Wrap AppRouter with PersistGate */}
        <AppRouter />
      </PersistGate>
    </I18nextProvider>
  );
};

export default App;
