import {FC, useState} from 'react';
import './СhecklistItem.scss';
import {Tab, Tabs} from "@mui/material";
import {ReviewCollapsingBox} from "@/components/ReviewCollapsingBox/index.tsx";
import ReviewImageBox from "@/components/ReviewImageBox/ReviewImageBox.tsx";
import {useTranslation} from "react-i18next";

interface Attachment {
  id: number
  name: string
}
interface InputData {
  InputId: number
  reviewer_status: string
  reviewer_remark: any
  Question: string
  QuestionArabic: string
  QuestionType: string
  Answer: any
  ApproveReject: boolean
  Remark?: string
  Attachment?: Attachment[]
  CulDetails: any
  DeviationData: any
}

interface IChecklistReviewProps {
  data: {
    ChecklistType: string
    ChecklistName: string
    Date: string
    ChecklistId: number
    InputData: InputData[]
    Remark: any
    Status: string
    ShowInputButtons: boolean
    ShowFeasibilityButtons: boolean
  }[]
}

const ChecklistReview: FC<IChecklistReviewProps> = ({data}) => {

  const {i18n} = useTranslation();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className='checklistItem'>
      <div className="checklistItem__items">
        <div className='checklistItem__bts'>
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
                  <Tab key={i} label={item.ChecklistType}/>
                )}
              </Tabs>
            </div>
          )}
          <ReviewCollapsingBox
            items={data[activeTabIndex]?.InputData.map((item, i) => {
              return {
                prefix: `${i + 1}.`,
                title: i18n.language === "ar" && item.QuestionArabic
                  ? item.QuestionArabic
                  : item.Question,
                comment: item.Answer,
                remark: item.Remark,
                imageArea: (
                  <ReviewImageBox media={item.Attachment ?? []}/>
                )
              }
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default ChecklistReview;