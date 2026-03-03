import {Fragment, useEffect, useState} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {getMediaContent} from "@/store/common/common.actions.ts";
import {useAppDispatch} from "@/hooks/redux.ts";
import Loader from "@/components/common/Loader";

interface MediaItem {
  SelfieContent: number;
  SiteContent: number;
}

interface CarouselProps {
  media: MediaItem[];
}

const Carousel: React.FC<CarouselProps> = ({ media = [] }) => {
  const dispatch = useAppDispatch();
  const [images, setImages] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    if (media.length > 0) {
      handleSlideChange();
    }
  }, [media]);

  const fetchImage = async (index: number) => {
    setLoading(true);
    try {
      const response = await dispatch(getMediaContent({media_ids: [index]}));
      setLoading(false);
      return response.payload;
    } catch (error) {
      console.error("Error fetching image:", error);
      setLoading(false);
      return null;
    }
  };


  const handleSlideChange = async (swiper?: SwiperType) => {
    const newIndex = swiper ? swiper.activeIndex : 0;
    const imageId = media[Math.floor(newIndex / 2)][newIndex % 2 === 0 ? 'SelfieContent' : 'SiteContent']
    if(images.has(imageId)) return;
    const newImage = await fetchImage(imageId);

    if (newImage) {
      setImages((prev) => new Map(prev).set(imageId, newImage[0].content));
    }
  };

  return (
    <Swiper
      grabCursor={true}
      pagination={{ type: "fraction" }}
      modules={[Navigation, Pagination]}
      navigation
      creativeEffect={{
        prev: { shadow: true, translate: ["-20%", 0, -1] },
        next: { translate: ["100%", 0, 0] },
      }}
      className="mySwiper3"
      onSlideChange={handleSlideChange}
    >
      {media.map((item, i) => (
        <Fragment key={i}>
          <SwiperSlide>
            {!loading && images.get(item.SelfieContent) ? <img src={`data:image/png;base64, ${images.get(item.SelfieContent)}`} alt={`Slide ${item.SelfieContent}`} /> : <Loader height={350} width='100%'><rect x='0' y={0} rx='4' ry='4' width='100%' height='100%'/></Loader>}
          </SwiperSlide>
          <SwiperSlide>
            {!loading && images.get(item.SiteContent) ? <img src={`data:image/png;base64, ${images.get(item.SiteContent)}`} alt={`Slide ${item.SiteContent}`} /> : <Loader height={350} width='100%'><rect x='0' y={0} rx='4' ry='4' width='100%' height='100%'/></Loader>}
          </SwiperSlide>
        </Fragment>
      ))}
    </Swiper>
  );
};

export default Carousel;
