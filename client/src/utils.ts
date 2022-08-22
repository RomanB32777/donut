import { NOTIFICATION_TYPE, Store } from 'react-notifications-component';
import moment from 'moment';
import postData from './functions/postData';
interface INotification {
    type: NOTIFICATION_TYPE
    title: string
    message?: string
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

declare type typeNotification = 'donat_creator' | 'donat_supporter' | 'following_creator' | 'following_backer' | 'add_badge_creator' | 'add_badge_supporter' | 'remove_badge_creator' |  'remove_badge_supporter';

export const getNotificationMessage = (type: typeNotification, user: any, data?: any) => {
  switch (type) {
    case 'donat_creator':
      return `${user} sent you ${data.additional ? data.additional.sum : data.sum} ${(data.additional ? data.additional.wallet : data.wallet ) === 'tron' ? 'TRX' : 'MATIC'}!`

      case 'donat_supporter':
        return `You sent ${data.additional ? data.additional.sum : data.sum} ${(data.additional ? data.additional.wallet : data.wallet ) === 'tron' ? 'TRX' : 'MATIC'} to ${user}!`
  
    case 'following_creator':
      return `${user} started following you`
      
    case 'following_backer':
      return `You started following ${user}`
      
    case 'add_badge_creator':
      return `You sent a badge ${data} to ${user}`

    case 'add_badge_supporter':
      return `You received a badge ${data} from ${user}`
      
    default:
      return `notification`
  }
}

export const DateFormatter = (date:string, toFormat: string = "DD/MM/YYYY HH:mm") => {
    let dateFormat = moment(date).format(toFormat)
    if (dateFormat === 'Invalid Date') dateFormat = ''
    return dateFormat
}

export const checkIsExistUser = async (token: string) => {
   const data = await postData("/api/user/check-user-exist/", { token });
   if (data.notExist) return false;
   return true;
};

export const checkNotifPermissions = () => {
  var status = false
  if ("Notification" in window) {
    if (localStorage.getItem("permissionsNotif")) {
      if (localStorage.getItem("permissionsNotif") === "true")
        status =  true
    }
    else if (Notification.permission === "granted")
      status =  true
     
    else Notification.requestPermission((permission) => {
      if (permission === "granted") {
        status = true;
      } else {
        status = false;
      }
    });
  }
  return status
}

export const getRandomStr = (length: number) => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
          charactersLength));
  }
  return result
}
