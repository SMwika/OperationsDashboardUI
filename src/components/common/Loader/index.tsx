import ContentLoader from "react-content-loader";
import {FC} from "react";

interface ILoaderProps {
  height: string | number;
  width: string | number;
  children: React.ReactNode;
}

const Loader: FC<ILoaderProps> = ({ height, width, children }) => {
  return (
    <ContentLoader
      height={height}
      width={width}
      speed={2}
      backgroundColor={'#d9d9d9'}
      foregroundColor={'#d9d9d9'}
      foregroundOpacity={.7}
    >
      {children}
    </ContentLoader>
  );
}

export default Loader;