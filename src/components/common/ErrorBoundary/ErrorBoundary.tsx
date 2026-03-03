import {FC} from "react";
import ErrorIcon from "../../../assets/icons/error.svg";
import './ErrorBoundary.scss';

interface IErrorProps {
  message: string | undefined;
}

const ErrorBoundary:FC<IErrorProps> = ({message}) => {
  return (
    <div className='errorBoundary'>
      <ErrorIcon/>
      <h3>{message}</h3>
    </div>
  );
};

export default ErrorBoundary;