import React from "react";
import classnames from "classnames";
import "./index.scss";

interface ReviewCollapsingBoxItem {
  prefix?: string;
  title?: string;
  isTitleDisabled?: boolean;
  comment?: string | number | null;
  images?: string[];
  iconArea?: React.ReactNode;
  imageArea?: React.ReactNode;
  checkbox?: React.ReactNode;
  remark?: string | null;
  showButtons?: React.ReactNode;
}

interface ReviewCollapsingBoxProps {
  items: ReviewCollapsingBoxItem[];
}

export const ReviewCollapsingBox: React.FC<ReviewCollapsingBoxProps> = ({ items = [] }) => {


  const renderLine = (item: ReviewCollapsingBoxItem, indexArr: number[]): JSX.Element | null => {
    const key = indexArr.join("-");

    return (
      <div className="lines" key={`${item.title}-${key}`}>
        <div className={classnames("line", `depth-${indexArr.length}`)}>
          <div className="title-area">
            <p className={classnames("title", { "is-disabled": item.isTitleDisabled })}>
              {item.checkbox} {item.prefix && <span>{item.prefix}</span>} {item.title}
            </p>
          </div>
          <div className="check-area">{item.iconArea}</div>
          <div className="comment-area"><p className="comment">{item.comment}</p></div>
          <div className="comment-area"><p className="comment">{item.remark}</p></div>
          <div className="comment-area actions">{item.showButtons}</div>
          <div className="image-area">{item.imageArea}</div>
        </div>
      </div>
    );
  };

  return <div className="review-collapsing-box">{items.map((item, i) => renderLine(item, [i]))}</div>;
};