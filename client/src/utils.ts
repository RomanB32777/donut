import { NOTIFICATION_TYPE, Store } from 'react-notifications-component';

interface INotification {
    type: NOTIFICATION_TYPE
    title: string
    message: string
}

export const addNotification = ({type, title, message}: INotification) => {
    Store.addNotification({
        title,
        message: message || '',
        type,
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
      });
}

export const addAuthNotification = () =>
    addNotification({
        title: "Authorization",
        message: "To perform this action, please register",
        type: "info",
      });

export const addSuccessNotification = (message: string) =>
addNotification({
    title: "Success",
    message,
    type: "success",
});
