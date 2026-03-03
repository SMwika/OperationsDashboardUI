import classnames from "classnames";
import {FC} from "react";

interface IClusterMarkerProps {
  points: number;
  lat: number;
  lng: number;
}

const ClusterMarker: FC<IClusterMarkerProps> = ({ points }) => (
  <div
    className={classnames(
      "cluster-marker",
      "circle-marker",
      points > 100 && "marker-long"
    )}>
    {points > 1 && <div className='marker-counter'>{points}</div>}
  </div>
);

export default ClusterMarker;