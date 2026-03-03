import {SYS_TYPES} from "@/constants";
import './Box.scss'
import {FC, Fragment, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Button, {BUTTON_COLORS} from "@/components/common/Button/Button.tsx";
import {ChevronRightIcon, HorBarIcon} from "@/components/Icons/Icons.tsx";
import { useTranslation } from "react-i18next";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartEvent,
  ActiveElement,
} from 'chart.js';
import {Collapse} from "@mui/material";
import classNames from "classnames";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface IBoxProps {
  title: string;
   item: Record<string, [any, string, string, Record<string, [any, string, string]>]>;
  doRedirect: (model: string, key: string) => void;
}

interface IDoughnutChartProps {
   item: Record<string, [any, string, string, Record<string, [any, string, string]>]>;
  doRedirect: (model: string, key: string) => void;
}

const DoughnutChart: FC<IDoughnutChartProps> = ({ item, doRedirect }) => {
  const d = Object.entries(item).filter(k => !k[0].includes('All'))
  const labels = d.map(i => i).map(j => j[0])
  const ldata = d.map(i => i).map(j => j[1][0])

  const data = {
    labels: labels,
    datasets: [
      {
        // label: 'Dataset 1',
        data: ldata,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Handle click event
  const handleChartClick = (_event: ChartEvent, elements: ActiveElement[]) => {
    if (elements.length > 0) {
      const clickedElementIndex = elements[0].index;
      const clickedLabel = data.labels[clickedElementIndex];
      // const clickedValue = data.datasets[0].data[clickedElementIndex];
      // console.log(item[clickedLabel][1], item[clickedLabel][2]);
      // console.log(`Clicked on: ${clickedLabel} with value: ${clickedValue}`);
      doRedirect(item[clickedLabel][1], item[clickedLabel][2]);
    }
  };

  // Define chart options
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
    onClick: handleChartClick
  };

  return (
    <Doughnut data={data} options={options}  />
  )
}

const Box: FC<IBoxProps> = ({ title, item, doRedirect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState("List");
  const Icon = SYS_TYPES[title as keyof typeof SYS_TYPES]?.icon;

  const handleRedirect = (item1: string, item2: string) => {
    if (item2 === 'unified.system.code') {
      navigate(`/unified-system-code?status=${item1}`, { replace: false });
    }else{
      doRedirect(item1, item2)
    }
  }

  const toggleExpanded = (attribute: string) => {
    setExpanded((prevExpanded) =>
      prevExpanded === attribute ? null : attribute,
    );
  };

  console.log('Box item:', item);
  
  return (
    <div className="box">
      <div className="box__wrapper">
        <div className="box__header">
          <div className="info">
            <div className={`info-item color-${SYS_TYPES[title as keyof typeof SYS_TYPES]?.color}`}>
              <div className="left-side">
                {Icon && <Icon/>}
              </div>
              <div className="right-side">
                <h2>
                  {title === 'Project'
                    ? <Link to='/projects'>{t(title)}</Link>
                    : title === 'Unified System Code'
                    ? <Link to='/unified-system-code'>{t(title)}</Link>
                    :  t(title)
                  }
                </h2>
              </div>
            </div>
          </div>
          <Button
            color={BUTTON_COLORS.GRAY}
            title={view === "List" ? t('Reports') : t('List')}
            IconNode={<HorBarIcon/>}
            onClick={() => view === "List" ? setView('Reports') : setView('List')}
            className='small'
          />
        </div>
        
        <ul className="items">
          {view === "List" ? Object.entries(item).map(([key, itm]) => (
            <Fragment key={key}>
              <li className={classNames("item parent-row", {hasChildren: !!itm[3], rowClosed: expanded !== key})} key={key} >
                <div className="item-block">
                  <span className="item-key" onClick={() => toggleExpanded(key)}>{t(key)}</span>
                  <span className="item-value formatter">{itm[0]}</span>
                  <span className="item-icon" onClick={() => handleRedirect(itm[1], itm[2])}>
                    <ChevronRightIcon/>
                  </span>
                </div>
              </li>
              <Collapse in={expanded === key} timeout="auto" unmountOnExit>
                {Object.entries(itm[3] || {})?.map(([key, item]) =>
                  <li className="item">
                    <div className="item-block">
                      <span className="item-key">{t(key)}</span>
                      <span className="item-value formatter">{item[0]}</span>
                      <span className="item-icon" onClick={() => handleRedirect(item[1], item[2])}>
                        <ChevronRightIcon/>
                      </span>
                    </div>
                  </li>
                )}

              </Collapse>
            </Fragment>
          )) : <>
            <div className="chart">
              <DoughnutChart doRedirect={(item1, item2) => handleRedirect(item1, item2)} item={item} />
            </div>
            {Object.entries(item).filter(k => k[0].includes('All')).map(([key, itm]) =>
            
            <li className="item" key={key} onClick={() => handleRedirect(itm[1], itm[2])}>
              <div className="item-block">
                <span className="item-key">{t(key)}</span>
                <span className="item-value formatter">{itm[0]}</span>
                <ChevronRightIcon />
              </div>
            </li>
              
          )}
          </>}
        </ul>
      </div>
    </div>
  );
};

export default Box;