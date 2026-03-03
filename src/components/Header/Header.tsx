import React, { useState, MouseEvent } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ChevronIcon from "../../assets/icons/chevron-down.svg";
import "./Header.scss";
import OtherAppsIcon from "../../assets/icons/other-apps.svg";
import {useGetLookupQuery} from "@/store/common/common.api.ts";
import {NavLink} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { updateLang } from "@/store/common/common.actions.ts";
import { useAppDispatch } from "@/hooks/redux.ts";

const Header: React.FC = () => {
  const {data} = useGetLookupQuery({username: sessionStorage.getItem("username")});
  const [anchorLogout, setAnchorLogout] = useState<null | HTMLElement>(null);
  const [anchorOtherApps, setAnchorOtherApps] = useState<null | HTMLElement>(null);
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const currentLang = localStorage.getItem('i18nextLng');

  const logoutUser = () => {
    localStorage.removeItem('encryptData');
    window.location.href = '/web/session/logout';
  };

  const handleMenuClick = (e: MouseEvent<HTMLDivElement>) => {
    setAnchorLogout(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorLogout(null);
  };

  const translate = () => {
    const newLang = currentLang === "en" ? "ar" : "en";
    const newLangCode = currentLang === "en" ? "ar_001" : "en_US";
    sessionStorage.setItem("lang", newLangCode);
    localStorage.setItem("i18nextLng", newLang);
    i18n.changeLanguage(newLang);
    dispatch(updateLang({ lang: newLangCode }));
  };

  return (
    <header className="header">
      <div className="section left">
        <div className='otherApps' onClick={e => setAnchorOtherApps(e.currentTarget)}>
          <OtherAppsIcon/>
        </div>
        <Menu
          className="menu"
          anchorEl={anchorOtherApps}
          open={Boolean(anchorOtherApps)}
          onClose={() => setAnchorOtherApps(null)}
          anchorOrigin={{vertical: "bottom", horizontal: "center"}}
          transformOrigin={{vertical: "top", horizontal: "center"}}
        >
          {data?.menu_list?.map((item: { name_ar: string; name: string; href: string }) =>
            <MenuItem key={item.name}>
              <a href={item.href}>{currentLang === 'ar' ? item.name_ar : item.name}</a>
            </MenuItem>
          )}
        </Menu>
        <div className="logo">
          <a href="/#/home">
            <img src={data?.logo_uri} alt=""/>
          </a>
        </div>
        <div className="site-name">
          <span>{data?.company_name}</span>
          <h2>{data?.tage_line}</h2>
        </div>
      </div>
      <div className="section middle">
        <nav>

          <NavLink to='/landing'>{t('Home')}</NavLink>
          <NavLink to='/unified-system-code'>{t('Unified System Code')}</NavLink>
          {data?.header_menu_list.map((item: { href: string; name: string; }, i: number) =>
            <a key={i} className='nav-link' href={item.href}>{t(item.name)}</a>
          )}
        </nav>
      </div>
      <div className="section right">
        <div className="icon-buttons">
          <div className="icon-button" onClick={translate}>
            {currentLang === 'en' ? 'ar' : 'en'}
          </div>
        </div>
        <div
          className={`dropdown ${Boolean(anchorLogout) ? "dropdownOpen" : ""}`}
          onClick={handleMenuClick}
        >
          <div className="name-holder">
            <p className="big">{data?.user.username}</p>
            <p className="small">{t(data?.user.stakeholder)}</p>
          </div>
          <ChevronIcon/>
        </div>
        <Menu
          className="menu"
          anchorEl={anchorLogout}
          open={Boolean(anchorLogout)}
          onClose={handleMenuClose}
          anchorOrigin={{vertical: "bottom", horizontal: "center"}}
          transformOrigin={{vertical: "top", horizontal: "center"}}
        >
          <MenuItem onClick={logoutUser}>{t('Log out')}</MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
