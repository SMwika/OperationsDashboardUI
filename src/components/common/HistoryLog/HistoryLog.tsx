import {getHumanDate} from "@/helpers";
import {CompletedIcon, PendingIcon} from "@/components/Icons/Icons.tsx";
import './HistoryLog.scss';
import {FC} from "react";
import classNames from "classnames";
import Progress from "@/components/common/Progress/Progress.tsx";
import {IProjectHistory} from "@/interfaces";

interface IHistoryLogProps {
  data: IProjectHistory
}

const HistoryLog: FC<IHistoryLogProps> = ({data}) => {

  return (
    <div className='historylog'>
      <Progress value={data.Progress} size={32} reverse/>
      {data.Items?.map((item, i) =>
        <div className={classNames('historylog__item', {pending: !item['Date Completed']})} key={i}>
          <div className='historylog__item__left'>
            {item['Date Completed'] ? <CompletedIcon/> : <PendingIcon/>}
          </div>
          <div className='historylog__item__right'>
            <div className='title'>{item.Title}</div>
            {item['Date Completed'] && <span>{getHumanDate(item['Date Completed'])}</span>}
            <span>{item['Date Completed'] ? 'Aging: ' : ''}{item.Aging}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryLog;