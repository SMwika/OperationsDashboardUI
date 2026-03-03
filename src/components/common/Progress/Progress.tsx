import './Progress.scss';
import {FC} from "react";
import {getProgressClassname} from "@/helpers";
import {PROGRESS_COLORS} from "@/constants";

interface IProgressProps {
  value: number;
  isActive?: boolean;
  textColor?: 'green' | 'yellow' | 'red';
  size?: number;
  reverse?: boolean;
}

const Progress: FC<IProgressProps> = ({value, isActive, textColor, size = 16, reverse}) => {
  const color = PROGRESS_COLORS[textColor ? textColor : getProgressClassname(value)];
  return (
    <div className='progressbar' style={{fontSize: `${size}px`, flexDirection: reverse ? 'row-reverse': 'row'}}>
      <div role="progressbar"
         style={{
           width: `${size}px`,
           height: `${size}px`,
           color,
           background: `radial-gradient(closest-side, ${!isActive ? 'white' : '#E6F2FC'} 60%, transparent 0 99.9%, ${!isActive ? 'white' : '#E6F2FC'} 0), conic-gradient(${color} calc(${value}%), #CFD2CD 0)`
         } as React.CSSProperties}
      />
      <span style={{color}}>{value}%</span>
    </div>
  );
};

export default Progress;