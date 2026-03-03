import SearchField from "@/components/common/SearchField/SearchField.tsx";
import {FC, useEffect, useState} from "react";
import MapView from "@/components/MapView/MapView.tsx";
import {useAppDispatch, useAppSelector} from "@/hooks/redux.ts";
import {IFilterState, IKeyValue} from "@/interfaces";
import {getSiteProjects} from "@/store/dashboard/dashboard.actions.ts";
import MyProjects from "@/pages/Dashboard/components/MyProjects/MyProjects.tsx";
import MyTasks from "@/pages/Dashboard/components/MyTasks/MyTasks.tsx";
import SideModal from "@/components/SideModal/SideModal.tsx";
import {doRedirect} from "@/helpers";
import classNames from "classnames";
import Progress from "@/components/common/Progress/Progress.tsx";
import {useTranslation} from "react-i18next";

interface IMapTabProps {
  options: IKeyValue | null;
  getData: (filters?: IFilterState, searchText?: string) => void
}

const TABS = [
  {title: 'General'},
  {title: 'Heatmap'},
  // {title: 'Coverage'},
]

const overviewData: {[key: string]: {total: number; percentage?: number; color?: 'green' | 'yellow' | 'red'}} = {
  'Total Roads': {total: 25},
  'Total Covered': {total: 11, percentage: 48, color: 'green'},
  'Total Partially Covered': {total: 8, percentage: 28, color: 'yellow'},
  'Total Uncovered': {total: 7, percentage: 18, color: 'red'},
}

const labels = [
  {title: '1-3 activities', color: '#25c7bc'},
  {title: '4-10 activities', color: '#3b80aa'},
  {title: 'More than 10 activities', color: '#602650'},
]
const coverageLabels = [
  {title: 'Covered', color: '#25c7bc'},
  {title: 'Partially Covered', color: '#9d67aa'},
  {title: 'Uncovered', color: '#602650'},
]


const MapTab: FC<IMapTabProps> = ({options, getData}) => {
  const [searchText, setSearchText] = useState("");
  const [currentView, setCurrentView] = useState<'General' | 'Heatmap' | 'Coverage'>('General');
  const [activeCoverageTab, setActiveCoverageTab] = useState('Total Roads');
  const [openSideModal, setOpenSideModal] = useState<number | null>(null);
  const filtersState = useAppSelector((state) => state.common.filters.filtersState);
  const mapData = useAppSelector(state => state.dashboard.mapData.data);
  const dispatch = useAppDispatch();
  const [selectedSite, setSelectedSite] = useState<string>('');
  const {t} = useTranslation();

  useEffect(() => {
    getData(undefined, searchText)
  }, [searchText]);

  const getDetails = (Id: number) => {
    dispatch(getSiteProjects({Id}))
  }

  const handleRedirect = (Id: number) => {
    doRedirect({Id, model: 'project.task', filtersState, dispatch})
  }

  const handleOpenSideModal = (Id: number | null) => {
    setOpenSideModal(Id)
  }

  return (
    <div className='map-tab' >
      <div id='map'>
        <div className="map-tab__header">
          <SearchField
            searchText={searchText}
            onChange={setSearchText}
            placeholder='Search by Site ID, Activity ID, Area, Region, City or Address'
            onClose={() => setSearchText('')}
          />
          <div className='view-tabs'>
            {TABS.map(({title}, i) =>
              <div
                key={i}
                className={classNames("view-tabs__tab", {active: currentView === title})}
                onClick={() => setCurrentView(title as 'General' | 'Heatmap' | 'Coverage')}
              >
                {t(title)}
              </div>
            )}
          </div>
        </div>
        {currentView === 'Coverage' && (
          <section className='overview'>
            {<div className='overview__items'>
              {overviewData && Object.keys(overviewData).map((key, i) =>
                <div
                  className={classNames(`overview__item overview__item--${overviewData[key].color}`, {active: activeCoverageTab === key})}
                  key={i}
                  onClick={() => setActiveCoverageTab(key)}
                >
                  <h5>{t(key)}</h5>
                  <div>
                    <h2>{overviewData[key].total}</h2>
                    {overviewData[key].hasOwnProperty('percentage') &&
                      <Progress
                        value={Math.round(Number(overviewData[key].percentage))}
                        isActive={activeCoverageTab === key}
                        textColor={overviewData[key].color}
                        size={28}
                      />}
                  </div>
                </div>
              )}
            </div>
            }
          </section>
        )}
        <MapView
          data={mapData}
          currentView={currentView}
          getDetails={getDetails}
          setSelectedSite={setSelectedSite}
          handleRedirect={handleRedirect}
          setOpenSideModal={handleOpenSideModal}
        />
        <ul className="chart__legends legends chart__row">
          {(currentView === 'Coverage' ? coverageLabels : labels).map((item, i) =>
            <li key={i}>
              <div className='legends__color' style={{backgroundColor: item.color}}/>
              <p>{t(item.title)}</p>
            </li>
          )}
        </ul>
      </div>
      {!['Supervisors', 'Supervisor', 'Implementation Team', 'Maintenance Team'].includes(String(options?.user?.stakeholder)) &&
        <MyProjects options={options} siteId={selectedSite}/>}
      <MyTasks options={options} siteId={selectedSite}/>
      {openSideModal && (
        <SideModal
          close={() => handleOpenSideModal(null)}
          options={options}
          id={openSideModal}
        />
      )}

    </div>
  );
};

export default MapTab;