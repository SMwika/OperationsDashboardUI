import './Switcher.scss';
import {FormControlLabel, Switch} from "@mui/material";
import {FC} from "react";

interface ISwitcherProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const Switcher: FC<ISwitcherProps> = ({label, checked, onChange, disabled}) => (
  <FormControlLabel
    disabled={disabled}
    control={
      <Switch
        checked={checked}
        onChange={() => onChange(!checked)}
        color="primary"
      />
    }
    labelPlacement="start"
    label={label}
  />
);

export default Switcher;