import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { store } from "./store";
import { Provider } from "react-redux";
import { PATH } from "@/constants";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { Inspector } from "react-dev-inspector";
import i18next from "i18next";
import ar from "./translations/ar-SA.json";
import en from "./translations/en-GB.json";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/auth/msal";

i18next.init({
  interpolation: { escapeValue: false },
  lng: localStorage.getItem("i18nextLng") || "en",
  resources: {
    en: {
      translation: en,
    },
    ar: {
      translation: ar,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    {/* <MsalProvider instance={msalInstance}> */}
    <BrowserRouter basename={import.meta.env.DEV ? PATH : ""}>
      <I18nextProvider i18n={i18next}>
        <Inspector>
          <App />
        </Inspector>
      </I18nextProvider>
    </BrowserRouter>
    {/* </MsalProvider> */}
  </Provider>,
);
