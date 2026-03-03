import classnames from "classnames";
import {DebounceInput} from "react-debounce-input";

import './SearchField.scss';
import {FC} from "react";
import {CloseIcon, SearchIcon} from "@/components/Icons/Icons.tsx";
import {useTranslation} from "react-i18next";

interface ISearchFieldProps {
  searchText: string;
  onChange: (text: string) => void;
  onClose: () => void;
  placeholder?: string;
}

const SearchField: FC<ISearchFieldProps> = ({searchText, onChange, placeholder, onClose}) => {
  const {t} = useTranslation();
  return (
    <div className='searchField'>
      <span className="search">
        <SearchIcon/>
      </span>
      <DebounceInput
        type="text"
        debounceTimeout={500}
        onChange={e => onChange(e.target.value)}
        value={searchText}
        placeholder={t(placeholder ?? "Search by keyword...")}
        name='search'
      />
      <span
        className={classnames("close", { active: searchText })}
        onClick={onClose}
      >
        <CloseIcon/>
      </span>

    </div>
  );
}

export default SearchField;