import Progress from "@/components/common/Progress/Progress.tsx";
import {FC} from "react";
import {useTranslation} from "react-i18next";
import {IProjectGeneral} from "@/interfaces";

interface IGeneralProps {
  data: IProjectGeneral
}

const General: FC<IGeneralProps> = ({data = {}}) => {
  const {t} = useTranslation();
  return (
    <div className="generalInfo">
      <Progress value={Number(data.Progress)} size={32} reverse/>
      <ul className='generalInfo__items'>
        <li><p>{t('Site Code')}</p> <span>{data['Site Code']}</span></li>
        <li><p>{t('Activity ID')}</p> <span>{data['Activity Id']}</span></li>
        <li><p>{t('System Type')}</p> <span>{data['System Type']}</span></li>
        <li><p>{t('Activities')}</p> <span>{data['Activities']}</span></li>
        <li><p>{t('Region')}</p> <span>{data['Region']}</span></li>
        <li><p>{t('District')}</p> <span>{data['District']}</span></li>
        <li><p>{t('City')}</p> <span>{data['City']}</span></li>
        <li><p>{t('Start Date')}</p> <span>{data['Start Date']}</span></li>
        <li><p>{t('Current Milestone')}</p> <span>{data['Current Milestone']}</span></li>
        <li><p>{t('Vendor')}</p> <span>{data['Vendor']}</span></li>
        <li><p>{t('Aging')}</p> <span>{data['Aging']}</span></li>
        <li><p>{t('Status')}</p> <span className='status'>{data['Status']}</span></li>
      </ul>
    </div>
  );
};

export default General;