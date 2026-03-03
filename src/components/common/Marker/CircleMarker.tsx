import {FC} from 'react';
import './Marker.scss';
import {useAppSelector} from "@/hooks/redux.ts";
import TableComponent from "@/components/TableComponent/TableComponent.tsx";
import useTable from "@/hooks/useTable.tsx";
import {IHeadCell} from "@/interfaces";
import {getStatusClassname} from "@/helpers";
import {useTranslation} from "react-i18next";
import Button, {BUTTON_COLORS} from "@/components/common/Button/Button.tsx";

interface ICircleMarkerProps {
  color: number | undefined;
  data: any;
  lat: number;
  lng: number;
  getDetails: (Id: number) => void;
  setPopupId: (Id: number | null) => void;
  setSelectedSite: (site_id: string) => void;
  handleRedirect?: (Id: number) => void;
  zIndex: number;
  setOpenSideModal?: (Id: number) => void;
}

const columns: IHeadCell[] = [
  {field: 'Site Code', headerName: 'Site Code', withOutSort: true},
  {field: 'Address', headerName: 'Address', withOutSort: true},
  {field: 'System', headerName: 'System', withOutSort: true},
  {field: 'Status', headerName: 'Status', withOutSort: true},
  {field: 'action', headerName: '', withOutSort: true},
];


const CircleMarker: FC<ICircleMarkerProps> = ({color, data, getDetails, setPopupId, setSelectedSite, handleRedirect, setOpenSideModal}) => {
  const siteProjects = useAppSelector(state => state.dashboard.siteProjects.data[data.id]);
  const loading = useAppSelector(state => state.dashboard.siteProjects.loading);
  const { tableQuery, handleRequestSort } = useTable(100);
  const {t} = useTranslation();

  return (
    <div
      className="marker-wrap"
      onClick={() => setSelectedSite(data.site_id)}
      onMouseEnter={() => {
        !siteProjects && getDetails(data.id);
        setPopupId(data.id)
      }}
      onMouseLeave={() => setPopupId(null)}
    >
      <div
        className={`marker circle-marker color-${color}`}
      >
        <div className='marker-counter'>{data["Project Count"]}</div>
        <div
          className='marker-popup'
          onClick={() => setOpenSideModal && setOpenSideModal(siteProjects?.[0]?.Id)}
        >
          {loading && <p>Loading...</p>}
          {siteProjects && !loading && <>
            <div className="marker-popup-info">
              <h5>{data.site_id}</h5>
              <div>
                <h3>{siteProjects.length}</h3>
                <p>{t(`Project${siteProjects.length > 1 ? 's' : ''}`)}</p>
              </div>
            </div>
            {siteProjects.length > 1 ? <TableComponent
              headCells={columns}
              data={siteProjects || []}
              showAll
              loading={loading}
              tableQuery={tableQuery}
              handleRequestSort={handleRequestSort}
              handleRedirect={handleRedirect}
              transformers={{
                Status: (row: { [key: string]: string }) => (
                  <span className={`status ${getStatusClassname(row.Status)}`}>
                  {row.Status}
                </span>
                ),
                action: (row: { [key: string]: string }) => (
                  <Button
                    title={t('Review details')}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenSideModal && setOpenSideModal(Number(row.Id));
                    }}
                    className='small'
                    color={BUTTON_COLORS.GRAY}
                  />
                ),
              }}
              options={{
                Address: {className: 'wide-cell'},
              }}
            /> : <div className="marker-popup-details">
              <div className="marker-popup-details-item">
                <span>{t('Site Code')}</span>
                <span>{siteProjects[0]['Site Code']}</span>
              </div>
              <div className="marker-popup-details-item">
                <span>{t('System')}</span>
                <span>{siteProjects[0]['System']}</span>
              </div>
              <div className="marker-popup-details-item">
                <span>{t('Address')}</span>
                <span>{siteProjects[0]['Address']}</span>
              </div>
              <div className="marker-popup-details-item">
                <span>{t('Start Date')}</span>
                <span>{siteProjects[0]['Start Date']}</span>
              </div>
              <div className="marker-popup-details-item">
                <span>{t('Milestone')}</span>
                <span>{siteProjects[0]['Milestone']}</span>
              </div>
              <div className="marker-popup-details-item">
                <span>{t('Progress')}</span>
                <span>{siteProjects[0]['Progress']}</span>
              </div>
              <div className="marker-popup-details-item">
                <span>{t('Status')}</span>
                <span>{siteProjects[0]['Status']}</span>
              </div>
              <div className="marker-popup-details-item">
                <span>{t('Pending Task')}</span>
                <span>{siteProjects[0]['Pending Task']}</span>
              </div>
            </div>}
          </>}
        </div>
      </div>
    </div>
  );
};

export default CircleMarker;