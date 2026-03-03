import {Gallery, Item} from "react-photoswipe-gallery";
import 'photoswipe/dist/photoswipe.css';
import noImage from "@/assets/icons/no-image.png";
import moreImages from "@/assets/icons/more-images.svg";
import './ReviewImageBox.scss';
import {FC, useState} from "react";
import {CircularProgress} from "@mui/material";
import {getMediaContent} from "@/store/common/common.actions.ts";
import {useAppDispatch} from "@/hooks/redux.ts";
import Button, {BUTTON_COLORS} from "@/components/common/Button/Button.tsx";
import {useTranslation} from "react-i18next";

interface IReviewImageBoxProps {
  media: {
    name: string;
    id: number;
  }[]
}

interface IImages {
  content: string
}

const ReviewImageBox: FC<IReviewImageBoxProps> = ({media = []}) => {
  const { t } = useTranslation();
  const [images, setImages] = useState<IImages[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const getImages = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getMediaContent({media_ids: [...media.map((i) => i.id)]}));
      setImages(res.payload);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  if (!media.length) return <img src={noImage} alt=''/>;
  if (loading) return <CircularProgress size='20px'/>;

  return (
    <div className='ReviewImageBox'>
      {images.length
        ? <Gallery>
          {images.slice(0, 1).map((item, key) =>
            <Item
              key={key}
              original={`data:image/png;base64, ${item.content}`}
              thumbnail={`data:image/png;base64, ${item.content}`}
              width="1024"
              height="683"
            >
              {({ref, open}) => (
                <img ref={ref} onClick={open} src={`data:image/png;base64, ${item.content}`} alt=''/>
              )}
            </Item>
          )}

          {media.length > 1 && (
            <Item
              original={`data:image/png;base64, ${images[1].content}`}
              thumbnail={`data:image/png;base64, ${images[1].content}`}
              width="1024"
              height="683"
            >
              {({ref, open}) => (
                <div className="visitReview__overlay" ref={ref} onClick={open}>
                  <img src={moreImages} alt=''/>
                  <p>{images.length - 1}</p>
                </div>
              )}
            </Item>
          )}
        </Gallery>
        : <Button title={t('Load')} onClick={getImages} className='small' color={BUTTON_COLORS.GRAY}/>
      }
    </div>
  )
};

export default ReviewImageBox;