import "./InfoTab.scss";
import { nFormatter } from "@/helpers";
import {SYS_TYPES} from "@/constants";
import {FC} from "react";
import {useTranslation} from "react-i18next";

interface InfoTabProps {
  dataInfo: {
    [key: string]: {
      [key: string]: [number, string, string];
    };
  }
}

export const InfoTab: FC<InfoTabProps> = ({dataInfo}) => {
  const {t} = useTranslation();
  return (
    <div className='info'>
      {Object.entries(dataInfo)?.map(([title, item]) => {
        const Icon = SYS_TYPES[title as keyof typeof SYS_TYPES]?.icon;
        return (
          <div key={title} className={`info-item color-${SYS_TYPES[title as keyof typeof SYS_TYPES]?.color}`}>
            <div className='left-side'>
              {Icon && <Icon/>}
            </div>
            <div className='right-side'>
              <h3>{nFormatter(item[`All ${title === 'Invoices' || title === 'Submittal' ? `Contractor invoices` : title === 'CR Project'? 'Change Requests' : title}`]?.[0], 1)}</h3>
              <p>{t(title)}</p>
            </div>
          </div>
        )
      })}
    </div>
  );
};
