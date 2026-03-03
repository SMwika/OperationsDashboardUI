import React, { useState, MouseEvent } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './MenuList.scss';
import SystemIcon from "../../assets/icons/system.svg";
import { Collapse, Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import chevronDown from '../../assets/icons/chevron-down.svg';

interface Link {
  name: string;
  hasSeparator: boolean;
  iconNode?: string;  // Assuming SystemIcon is a string; otherwise, type it as needed
  linkUrl?: string;
  childUrls?: string[];
  hasChildren?: boolean;
  children?: SubLink[];
}

interface SubLink {
  name: string;
  iconNode?: string;
  hasSeparator: boolean;
  linkUrl: string;
  hidden?: boolean;
  access?: string[];
}

interface MenuListProps {
  title?: string;
  header?: string;
  headerLinkUrl?: string;
  headerIcon?: string;
  navHide?: boolean;
}

const MenuList: React.FC<MenuListProps> = (props) => {
  const location = useLocation();
  const [openLink, setOpenLink] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const username = sessionStorage.getItem("username");

  const links: Link[] = [
    {
      name: "Dashboard",
      hasSeparator: false,
      iconNode: SystemIcon,
      linkUrl: "/",
    },
  ];

  const checkActiveLink = (path: string) => {
    return location.pathname.includes(path);
  };

  const checkActiveSubLink = (paths: string[]) => {
    return paths.includes(location.pathname);
  };

  const { title, header, headerLinkUrl, headerIcon, navHide } = props;

  return (
    <div className="menu-list">
      {header && (
        <NavLink
          to={{ pathname: headerLinkUrl, search: window.location.search }}
          className={({isActive})=> `header ${isActive ? "menu-link-active" :""}`}
          end
        >
          {headerIcon && <img className="icon" src={headerIcon} alt="icon" />}
          <span>{header}</span>
        </NavLink>
      )}

      <div className="title-text">{title}</div>

      <div className="links">
        {links.map((link, i) => (
          link.hasChildren ? (
            <div key={link.name}>
              <div
                onClick={(e: MouseEvent<HTMLDivElement>) => {
                  setAnchorEl(e.currentTarget);
                  setOpenLink(openLink === link.name ? null : link.name);
                }}
                className={`link has-icon menu-item-has-children ${
                  checkActiveSubLink(link.childUrls || []) ? "menu-link-active" : ""
                }`}
              >
                {link.iconNode && <link.iconNode/>}
                <span className="link-name">{link.name}</span>
                <img
                  src={openLink === link.name || checkActiveSubLink(link.childUrls || []) ? chevronDown : chevronDown}
                  alt=""
                />
              </div>

              <div className="subLinks">
                {navHide ? (
                  openLink === link.name && (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => {
                        setAnchorEl(null);
                        setOpenLink(null);
                      }}
                      className="menu-list menu-list-popup"
                    >
                      {link.children?.map((childLink) => {
                        if (childLink.hidden && !childLink.access?.includes(username ?? '')) return null;
                        return (
                          <MenuItem key={childLink.name} onClick={() => {
                            setAnchorEl(null);
                            setOpenLink(null);
                          }}>
                            <NavLink
                              className={`link subLink ${
                                checkActiveLink(childLink.linkUrl) ? "menu-link-active" : ""
                              }`}
                              to={{ pathname: childLink.linkUrl, search: window.location.search }}
                              aria-current="page"
                            >
                              <span className="link-name">{childLink.name}</span>
                            </NavLink>
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  )
                ) : (
                  <Collapse in={openLink === link.name} timeout="auto">
                    {link.children?.map((childLink) => (
                      <NavLink
                        key={childLink.name}
                        className={`link subLink ${
                          checkActiveLink(childLink.linkUrl) ? "menu-link-active" : ""
                        }`}
                        to={{ pathname: childLink.linkUrl, search: window.location.search }}
                        aria-current="page"
                      >
                        {childLink.iconNode && <childLink.iconNode/>}
                        <span className="link-name">{childLink.name}</span>
                      </NavLink>
                    ))}
                  </Collapse>
                )}
              </div>
            </div>
          ) : (
            <NavLink
              to={{ pathname: link.linkUrl || '', search: window.location.search }}
              key={i}
              className={`link ${link.hasSeparator ? 'has-separator' : ''}`}
            >
              {link.iconNode && <link.iconNode/>}
              <span className="link-name">{link.name}</span>
            </NavLink>
          )
        ))}
      </div>
    </div>
  );
};

export default MenuList;
