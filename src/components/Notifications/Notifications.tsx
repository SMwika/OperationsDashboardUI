import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {setNotificationMessage} from "../../store/common/common.slice.ts";

const Notifications = () => {

  const dispatch = useAppDispatch();
  const notification = useAppSelector(state => state.common.notification);
  const {snackbarMessage, snackbarSeverity, openSnackbar} = notification;

  const closeSnackbar = () => {
    dispatch(setNotificationMessage({snackbarMessage: '', snackbarSeverity: 'info', openSnackbar: false}));
  }

  return (
    <Snackbar
      open={openSnackbar}
      onClose={closeSnackbar}
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      autoHideDuration={3000}
      TransitionComponent={Slide}
    >
      <Alert onClose={closeSnackbar} severity={snackbarSeverity}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
}

export default Notifications;
