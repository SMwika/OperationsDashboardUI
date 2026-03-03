import Header from "./components/Header/Header";
import { useInsertionEffect, useEffect } from "react";
// import HamburgerIcon from './assets/icons/hamburger.svg';
// import MenuList from "./components/MenuList/MenuList.tsx";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import "./assets/styles/tailwind.css";
import "./assets/styles/index.scss";
import Notifications from "./components/Notifications/Notifications.tsx";
import { decryptData } from "@/helpers";
import { useAppDispatch } from "@/hooks/redux.ts";
import { setUserData } from "@/store/common/common.slice.ts";
import classnames from "classnames";
import { useTranslation } from "react-i18next";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();

  useInsertionEffect(() => {
    const odooCss = document.querySelector(
      'link[href*="/web.assets_frontend.min.css"]',
    );
    if (odooCss) {
      odooCss.setAttribute("disabled", "true");
    }
  }, []);

  useEffect(() => {
    if (window.location.search.slice(1)) {
      localStorage.setItem("encryptData", window.location.search.slice(1));
      const parsed = decryptData(window.location.search.slice(1));
      console.log(location.pathname, parsed, "parsed");
      dispatch(setUserData(parsed));

      if (parsed.lang) {
        sessionStorage.setItem("lang", parsed?.lang);
      }
      const lang = sessionStorage.getItem("lang");
      if (lang) {
        const nextLang = lang === "ar_001" ? "ar" : "en";
        localStorage.setItem("i18nextLng", nextLang);
        i18n.changeLanguage(nextLang);
      }
      if (parsed.username) {
        navigate(location.pathname, { replace: true });
      }
    }
  }, []);

  return (
    <div
      className={classnames(`app-container`, {
        rightCtl: i18n.language === "ar",
      })}>
      {/*<BrowserRouter basename={import.meta.env.DEV ? PATH : ''}>*/}
      <Header />
      <div className='content-section'>
        <Routes>
          <Route path='/' element={<Navigate to='/landing' />} />
          <Route path='/landing' element={<Dashboard />} />
        </Routes>
      </div>
      {/*</BrowserRouter>*/}
      <Notifications />
    </div>
  );
}

export default App;
