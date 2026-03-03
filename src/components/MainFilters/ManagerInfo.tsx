import {FC} from "react";
import {UserIcon} from "@/components/Icons/Icons.tsx";
import {useTranslation} from "react-i18next";

interface IManagerInfoProps {
  name: string;
}
const ManagerInfo: FC<IManagerInfoProps> = ({name}) => {
  const {t} = useTranslation();
  return (
    <div className='manager-info'>
      <div className='manager'>
        <div className='manager-img'>
          <UserIcon/>
        </div>
        <div className='manager-content'>
          <div className='manager-position'>{t('Project Manager')}</div>
          <div className='manager-name'>
            {t(name || 'Project Manager')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerInfo;