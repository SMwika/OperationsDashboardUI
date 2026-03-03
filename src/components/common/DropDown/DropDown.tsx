import {useState, useRef, FC, useEffect, SyntheticEvent} from 'react';
import Button, {BUTTON_COLORS} from '../Button/Button';
import './DropDown.scss';
import classNames from "classnames";
import {
  Button as MuiButton,
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  Grow,
  MenuList,
  Paper,
  Popper
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {IFilterState, IKeyValue} from "@/interfaces";
import SearchField from "@/components/common/SearchField/SearchField.tsx";
import {CloseIcon} from "@/components/Icons/Icons.tsx";
import {useTranslation} from "react-i18next";

interface IDropDownProps {
  title: string;
  name: string;
  listItems: { [key: string]: string | number }[];
  onChange: (...args: any[]) => void;
  filtersState: IFilterState;
  onApply: (filters?: IFilterState) => void;
  lookup?: IKeyValue | null;
  withoutArrow?: boolean;
  isSingle?: boolean | undefined;
  disabled?: boolean;
}

const DropDown: FC<IDropDownProps> = ({
  title,
  listItems,
  withoutArrow,
  name,
  filtersState,
  onChange,
  onApply,
  isSingle,
  disabled
}) => {

  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [visibleItems, setVisibleItems] = useState<number>(20);
  const [filteredItems, setFilteredItems] = useState(listItems);
  const [searchText, setSearchText] = useState<string>('');
  const {t} = useTranslation();

  useEffect(() => {
    listItems.length && setFilteredItems(listItems)
  }, [listItems]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent | SyntheticEvent<Element, Event>) => {
    const target = event.target as HTMLElement;
    if (anchorRef.current && anchorRef.current.contains(target)) {
      return;
    }
    setOpen(false);
  };

  const isActive = !!Object.keys(filtersState[name])?.length;

  const handleSearch = (value: string): void => {
    setSearchText(value);
    setFilteredItems(value ? listItems.filter(item => String(item.value).toLowerCase().includes(value.toLowerCase())) : listItems);
  };

	return (
		<div className='dropDown'>
			<MuiButton
				className={classNames({filtered: filtersState && isActive})}
				ref={anchorRef}
				aria-controls={open ? 'menu-list-grow' : undefined}
				aria-haspopup="true"
				onClick={handleToggle}
        disabled={disabled}
			>
				<p>{t(title)}: {isActive ? Object.keys(filtersState[name])[0] : t('All')}</p>
        {Object.keys(filtersState[name])?.length > 1 && <span className='dropDown__count'>+{Object.keys(filtersState[name]).length - 1}</span>}
				{!withoutArrow && <div className='arrow-down' />}
        {isActive && (
          <span className="clear" onClick={(e) => {
            e.stopPropagation();
            onChange(name, true);
          }}>
            <CloseIcon/>
          </span>
        )}

      </MuiButton>
			<Popper open={open} anchorEl={anchorRef.current} placement='bottom' transition disablePortal style={{zIndex: '1'}}>
				{({ TransitionProps }) => (
					<Grow
						{...TransitionProps}
						style={{ transformOrigin: 'top' }}
					>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow">
                  <SearchField searchText={searchText} onChange={handleSearch} onClose={() => handleSearch('')}/>
                  <div className='dropDown-items'>
                    {filteredItems?.slice(0, visibleItems).map(item => {
                        const isChecked = filtersState[name]?.hasOwnProperty(item.value);
                        return (
                          <MenuItem key={item.id}>
                            <FormControlLabel
                              onChange={(e) => {
                                onChange(name, false, isChecked, item);
                                isSingle && handleClose(e);
                              }}
                              control={<Checkbox checked={isChecked}/>}
                              label={t(String(item.value))}
                            />
                          </MenuItem>
                        )
                      }
                    )}
                    {filteredItems?.length > visibleItems && (
                      <div className="load-more">
                        <Button color={BUTTON_COLORS.GRAY} title={t('Load more')}
                                onClick={() => setVisibleItems(visibleItems + 20)}/>
                      </div>
                    )}
                  </div>
                  {!!onApply && (
                    <div className='apply-btn'>
                      <Button
                        color={BUTTON_COLORS.DEFAULT}
                        title={t('Apply')}
                        onClick={e => {
                          onApply();
                          handleClose(e);
                        }}
                      />
                    </div>
                  )}

                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
};

export default DropDown;