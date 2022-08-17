import { NOTIFICATION_TYPE, Store } from 'react-notifications-component';
import moment from 'moment';
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

declare type typeNotification = 'donat_creater' | 'donat_supporter' | 'following_creater' | 'following_backer';

export const getNotificationMessage = (type: typeNotification, user: any, data?: any) => {
  switch (type) {
    case 'donat_creater':
      return `${user} sent you ${data} TRX!`

      case 'donat_supporter':
        return `You sent ${data} TRX to ${user}!`
  
    case 'following_creater':
      return `${user} started following you`
      
    case 'following_backer':
      return `You started following ${user}`
      
    default:
      return `notification`
  }
}


export const DateFormatter = (date:string, toFormat: string = "DD/MM/YYYY HH:mm") => {
    let dateFormat = moment(date).format(toFormat)
    if (dateFormat === 'Invalid Date') dateFormat = ''
    return dateFormat
}
