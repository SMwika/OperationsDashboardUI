import {
  Dialog,
  DialogContent, Tabs, Tab,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import HistoryLog from "@/components/common/HistoryLog/HistoryLog.tsx";
import {IKeyValue} from "@/interfaces";
import Button, {BUTTON_COLORS} from "@/components/common/Button/Button.tsx";
import './SideModal.scss';
import {CloseIcon, ArrowLeftIcon, ExternalIcon} from "@/components/Icons/Icons.tsx";
import General from "@/components/SideModal/components/General.tsx";
import UnifiedSystemCodes from "@/components/SideModal/components/UnifiedSystemCodes.tsx";
import Tasks from "@/components/SideModal/components/Tasks.tsx";
import {useTranslation} from "react-i18next";
import {getChecklist, getFieldTaskAttendance, getProjectInfo} from "@/store/dashboard/dashboard.actions.ts";
import {useAppDispatch, useAppSelector} from "@/hooks/redux.ts";
import ChecklistReview from "@/components/SideModal/components/ChecklistReview/ChecklistReview.tsx";
import {doRedirect} from "@/helpers";
import Carousel from "@/components/SideModal/components/Carousel/Carousel.tsx";
import {clearSideModalData} from "@/store/dashboard/dashboard.slice.ts";

interface ISideModalProps {
  close: () => void;
  buttons?: React.ReactNode | undefined;
  options: IKeyValue | null;
  id: number | null;
}

const data = {
  media: [
    'https://naurok-test.nyc3.cdn.digitaloceanspaces.com/uploads/test/446833/162960/610866_1586247693.jpg',
    'https://i1.wp.com/digital-photography-school.com/wp-content/uploads/2019/10/Karthika-Gupta-Compelling-Nature-Photos-6.jpg?fit=1500%2C1000&ssl=1',
    'https://i.pinimg.com/originals/a1/92/5f/a1925fe1ea3874b944f0b2a2777b3b20.jpg',
  ],
}

const SideModal: React.FC<ISideModalProps> = ({close, options, id}) => {
  const [tab, setTab] = useState("general");
  const [isGalleryView, setIsGalleryView] = useState<boolean>(false);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const checklist = useAppSelector((state) => state.dashboard.checklist.data);
  const projectInfo = useAppSelector((state) => state.dashboard.projectInfo.data);
  const filtersState = useAppSelector((state) => state.common.filters.filtersState);
  const systemTypes = useAppSelector((state) => state.common.filters.systemTypes);
  const fieldTasksAttendance = useAppSelector((state) => state.dashboard.fieldTasksAttendance.data);

  useEffect(() => {
    dispatch(getChecklist({"activity_id": id}));
    dispatch(getProjectInfo({"activity_id": id}));
    dispatch(getFieldTaskAttendance({"ActivityId": id}));

    return () => {
      dispatch(clearSideModalData());
    };
  }, []);

  const handleRedirect = (Id: number) => {
    doRedirect({Id, model: 'project.project', filtersState, dispatch, systemTypes})
  }

  return (
    <Dialog className='sideModal' open={true} onClose={close} disablePortal>
      <div className="sideModal__btns">
        {!isGalleryView
          ? <Button
              title={t('View full project')}
              color={BUTTON_COLORS.TRANSPARENT}
              onClick={() => handleRedirect(id as number)}
              EndIcon={<ExternalIcon/>}
            />
          : <Button
              title={t('Back')}
              IconNode={<ArrowLeftIcon/>}
              color={BUTTON_COLORS.TRANSPARENT}
              onClick={() => {setIsGalleryView(false)}}
            />
        }
        <Button title='' color={BUTTON_COLORS.TRANSPARENT} onClick={close} IconNode={<CloseIcon/>}/>
      </div>
      <DialogContent>
        {!isGalleryView
          ? <>
              <h2>{projectInfo?.General?.[0]?.['Site Id']}</h2>
              <Carousel media={fieldTasksAttendance}/>
              <div className="tabs-block">
                <Tabs
                  value={tab}
                  onChange={(_, newValue) => setTab(newValue)}
                  indicatorColor="primary"
                  textColor="primary"
                  orientation="horizontal"
                  sx={{borderBottom: 1, borderColor: 'divider'}}
                >
                  <Tab label={t('General')} value="general"/>
                  <Tab label={t('Survey')} value="survey"/>
                  <Tab label={t('Unified System Codes')} value="unifiedSystemCodes"/>
                  <Tab label={t('My Tasks')} value="my-tasks"/>
                  <Tab label={t('History')} value="history"/>
                </Tabs>
              </div>
              {tab === 'general' && (
                <General data={projectInfo?.General?.[0]}/>
              )}
              {tab === 'survey' && (
                <ChecklistReview data={checklist}/>
              )}
              {tab === 'unifiedSystemCodes' && (
                <UnifiedSystemCodes  data={projectInfo.UnifiedSystemCodes}/>
              )}
              {tab === 'my-tasks' && (
                <Tasks data={projectInfo?.MyTasks} options={options}/>
              )}
              {tab === 'history' && (
                <HistoryLog data={projectInfo.History}/>
              )}
            </>
          : data.media.map((item, i) =>
              <img key={i} src={item} alt="image"/>
            )
        }
      </DialogContent>
    </Dialog>
  );
}

export default SideModal;
