import React, {FC} from 'react';
import classnames from 'classnames';
import './Button.scss';
import {CircularProgress} from "@mui/material";

export const BUTTON_COLORS = {
  DEFAULT: 0,
  GRAY: 1,
  TRANSPARENT: 2,
  FULLY_TRANSPARENT: 3,
  GREEN: 4,
  RED: 5,
  ORANGE: 6,
  PRIMARY: 7,
  DARK: 8,
  RED_TRANSPARENT: 9
};

interface IButtonProps {
  title: string;
  color?: number;
  IconNode?: React.ReactNode;
  IconNodeStyles?: React.CSSProperties;
  EndIcon?: React.ReactNode;
  EndIconStyles?: React.CSSProperties;
  onClick: (e?: any) => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}

const Button: FC<IButtonProps> = ({
  title, color, IconNode, IconNodeStyles, EndIcon, EndIconStyles,
  onClick, active, disabled, className, loading, ...props
}) => {
  return (
    <button
      className={classnames("button", `button-color-${color || BUTTON_COLORS.DEFAULT}`, className, {
        active: active,
        disabled: disabled,
        withoutText: !title
      })}
      onClick={onClick}
      {...props}
    >
      {IconNode && <div style={IconNodeStyles}>{IconNode}</div>}
      {loading && <CircularProgress size='20px'/>}
      {title && <p>{title}</p>}
      {EndIcon && <div style={{ marginLeft: 10, maxWidth: 18, position: 'static', ...EndIconStyles }}>{EndIcon}</div>}
    </button>
  );
}

export default Button;