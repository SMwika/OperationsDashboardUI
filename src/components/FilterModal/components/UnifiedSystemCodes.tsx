import TableComponent from "@/components/TableComponent/TableComponent.tsx";
import {FC, useState} from "react";
import {getStatusClassname} from "@/helpers";
import {useTranslation} from "react-i18next";
import {Tab, Tabs} from "@mui/material";
import {IProjectUnifiedSystemCode} from "@/interfaces";

interface IUnifiedSystemCodesProps {
  data: IProjectUnifiedSystemCode[]
}

const UnifiedSystemCodes: FC<IUnifiedSystemCodesProps> = ({data}) => {
  const {t} = useTranslation();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <div>
      {data.length > 1 && (
        <div className="tabs-block">
          <Tabs
            value={activeTabIndex}
            onChange={(_, newValue) => setActiveTabIndex(newValue)}
            indicatorColor="primary"
            textColor="primary"
            orientation="horizontal"
            variant="scrollable"
            sx={{borderBottom: 1, borderColor: 'divider'}}
          >
            {data.map((item, i) =>
              <Tab key={i} label={item.Title}/>
            )}
          </Tabs>
        </div>
      )}
      {data[activeTabIndex] && (
        <div className="generalInfo">
          <h2>{data[activeTabIndex].Title}</h2>
          <ul className='generalInfo__items'>
            <li><p>{t('Status')}</p> <span className='status'>{data[activeTabIndex]['Status']}</span></li>
            <li><p>{t('System Type')}</p> <span>{data[activeTabIndex]['System Type']}</span></li>
            <li><p>{t('Site Code')}</p> <span>{data[activeTabIndex]['Site Code']}</span></li>
            <li><p>{t('Direction')}</p> <span>{data[activeTabIndex]['Direction']}</span></li>
            <li><p>{t('Region')}</p> <span>{data[activeTabIndex]['Region']}</span></li>
            <li><p>{t('Current Milestone')}</p> <span>{data[activeTabIndex]['Current Milestone']}</span></li>
            {data[activeTabIndex]['Vendor'] && <li><p>{t('Vendor')}</p> <span>{data[activeTabIndex]['Vendor']}</span></li>}
          </ul>
          <h3>{t('Services')}</h3>
          <TableComponent
            headCells={[
              {field: 'Name', headerName: 'Name', withOutSort: true},
              {field: 'Identifier', headerName: 'Id', withOutSort: true},
              {field: 'Status', headerName: 'Status', withOutSort: true},
            ]}
            data={data[activeTabIndex].Services || []}
            showAll
            tableQuery={{}}
            handleRequestSort={() => {
            }}
            transformers={{
              status: (row: { [key: string]: string }) => (
                <span className={`status ${getStatusClassname(row.status)}`}>
              {row.status}
            </span>
              ),
            }}
          />
          <h3>{t('Components')}</h3>
          <TableComponent
            headCells={[
              {field: 'component', headerName: 'Component', withOutSort: true},
              {field: 'Id', headerName: 'Id', withOutSort: true},
            ]}
            data={data[activeTabIndex].Components || []}
            showAll
            tableQuery={{}}
            handleRequestSort={() => {
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UnifiedSystemCodes;