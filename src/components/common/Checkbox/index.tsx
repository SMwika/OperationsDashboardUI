import React from "react";
import "./index.scss";

interface CheckboxProps {
  title?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export class Checkbox extends React.Component<CheckboxProps> {
  static defaultProps: CheckboxProps = {
    title: "",
    checked: false,
    onChange: undefined,
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(e.currentTarget.checked);
    }
  };

  render() {
    const { title, checked } = this.props;

    return (
      <label className="checkbox">
        <input
          onChange={this.onChange}
          type="checkbox"
          checked={checked}
          name="checkbox"
        />
        {title && <span>{title}</span>}
      </label>
    );
  }
}
