import axiosClient from "../../axiosClient"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import BlueButton from "../../commonComponents/BlueButton"
import PageTitle from "../../commonComponents/PageTitle"
import { url } from "../../consts"
import asyncQuery from "../../functions/asyncQuery"
import getTronWallet from "../../functions/getTronWallet"
import { DiscordIcon, FacebookIcon, LargeImageIcon, PencilIcon, TronIcon, TwitterIcon, YoutubeIcon } from "../../icons/icons"
import routes from "../../routes"
import { tryToGetUser } from "../../store/types/User"

import './styles.sass'

const titles = [
    'profile_form_title_name',
    'profile_form_title_username',
    'profile_form_title_wallet',
    'profile_form_title_socials',
]

const socials = [
    {
        title: 'facebook',
        icon: <FacebookIcon/>
    },
    {
        title: 'google',
        icon: <YoutubeIcon/>
    },
    {
        title: 'twitter',
        icon: <TwitterIcon/>
    },
    {
        title: 'discord',
        icon: <DiscordIcon/>
    },
]

const ProfilePageContainer = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const tron_wallet = getTronWallet()

    const user = useSelector( (state: any) => (state.user) )

    const [form, setForm] = useState<any>({
        tron_token: '',
        person_name: '',
        twitter: '',
        facebook: '',
        google: '',
        discord: '',
        avatarlink: '',
    })

    const [isChanged, setIsChanged] = useState<boolean>(false)
    const [isNameExist, setIsNameExist] = useState<boolean>(false)

    const [isSaved, setIsSaved] = useState<boolean>(false)

    const [isTronCopied, setIsTronCopied] = useState<boolean>(false)

    const copyTron = () => {
        navigator.clipboard.writeText(getTronWallet())
        setIsTronCopied(true)
        setTimeout( () => setIsTronCopied(false), 3000)
    }

    const getUser = async (tron_token: string) => {
        const data = await asyncQuery(
            'GET',
            '/api/user/'+tron_wallet
        )
        if (data.person_name && data.person_name.length>0) {
            setIsNameExist(true)
        }
        setForm({
            ...data,
            person_name: data.person_name,
            avatarlink: data.avatarlink
        })
    }

    useEffect( () => {
        if (user.id) {
            getUser(getTronWallet())
        } else {
            navigate(routes.main)
        }
        
    }, [user])

    const [file, setFile] = useState<any>();
    const [fileName, setFileName] = useState("");
    const [imagebase64, setImagebase84] = useState<any>('')

    const sendFile = async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName)
        const res = await axiosClient.post('/api/user/user/edit-image/'+tron_wallet, formData)
        if (res.status===200) {
            return res
        }
        //dispatch(tryToGetPersonInfo(pathname.slice(pathname.indexOf('@'))))
    }

    const saveProfile = async () => {


        await axiosClient.post(
            "/api/user/user/edit/",
            {...form, tron_token: tron_wallet}
        )
        if (imagebase64.length >0 ) {
            sendFile()
        }
        setFileName('')
        setFile(null)
        setIsChanged(false)
        setIsSaved(true)
        setTimeout( () => setIsSaved(false), 3000)
        getUser(getTronWallet())
        dispatch( tryToGetUser(getTronWallet()) )
        
    }

    const fileToBase64 = (file: any) => {
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => setImagebase84(reader.result);
            reader.onerror = (error) => reject(error);
        })
    }

    const saveFile = (ev: any) => {
        if (ev.target.files[0].size <= 3 * 1024 * 1024) {
            setFile(ev.target.files[0]);
            fileToBase64(ev.target.files[0])
            setIsChanged(true)
            setFileName(ev.target.files[0].name);
        }
    };

    return (
        <div
            className="profile-page"
        >
            <PageTitle formatId="page_title_my_profile" />


            <div
                className="profile-page__file-input"
            >
                <span
                    className="profile-page__file-input__title"
                >
                    <FormattedMessage id='profile_form_file_title'/>
                </span>
                <span
                    className="profile-page__file-input__subtitle"
                >
                    <FormattedMessage id='profile_form_file_subtitle'/>
                </span>
                <div
                    className="profile-page__file-input__row"
                >
                    <div
                        className="profile-page__file-input__row__image"
                    >
                    {
                        (imagebase64 && imagebase64.length>0 || form.avatarlink && form.avatarlink.length>0)
                        ?
                        <img src={imagebase64 && imagebase64.length && imagebase64.length>0 ? imagebase64 : (form.avatarlink.length>0 && (url+form.avatarlink) )} />
                        :
                        <LargeImageIcon/>
                    }
                    </div>
                    <div
                        className="profile-page__file-input__row__button"   
                    >
                        <input 
                            type='file'
                            onChange={saveFile}
                            accept="image/jpeg,image/jpg,image/png"
                        />
                    </div>
                </div>

            </div>
            <div
                className="profile-page__form"
            >
                <div
                    className="profile-page__form__titles"
                    style={{
                        width: document.body.clientWidth>640 ? 'calc(50% - 12px)' : '30%',
                    }}
                >
                    {
                        titles.map( (title) => (
                            <span
                                key={title}
                            >
                                <FormattedMessage id={title} />
                            </span>
                        ))
                    }
                </div>
                <div
                    className="profile-page__form__info"
                    style={{
                        width: document.body.clientWidth>640 ? 'calc(50% - 12px)' : '65%',
                    }}
                >
                    <span>
                        {
                            isNameExist
                            ? 
                            form.person_name 
                            : 
                            <input 
                                type='text' 
                                value={form.person_name}
                                onChange={(event) => {
                                    setIsChanged(true)
                                    setForm({...form, person_name: event.target.value})
                                }}
                            />
                        }
                    </span>
                    <span>
                        {
                            form.username
                        }
                    </span>
                    <span 
                        onClick={() => copyTron()} 
                    >  
                        <div>
                            <TronIcon/> 
                        </div>
                        { ( getTronWallet() && getTronWallet().length > 13) ? (getTronWallet().slice(0,6)+'...'+getTronWallet().slice(getTronWallet().length-6,)) : 'mytoken' }
                        

                    
                    </span>
                    <div
                        className="profile-page__form__info__socials"
                    >
                        {
                            socials.map( (social) => (
                                <div
                                    key={'profile-page-social-form-'+social.title}
                                >
                                    {
                                        social.icon
                                    }
                                    <input 
                                        type='text'
                                        value={form[social.title]}
                                        onChange={ event => {
                                            setIsChanged(true)
                                            setForm({...form, [social.title]: event.target.value})
                                        }}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            {
                <div
                    className="profile-page__save-button"
                    style={{
                        opacity: ( isChanged || fileName.length>0 ) ? '1' : '0'
                    }}
                >
                    <BlueButton
                        formatId="profile_form_save_button"
                        padding='6px 30px'
                        onClick={() => saveProfile()}
                        fontSize='18px'
                    />
                </div>
            }

            <span
                className="save-message"
                style={{
                    opacity: isSaved ? '1' : '0'
                }}
            >
                Saved successfully
            </span>

            <span
                className="copy-message"
                style={{
                    opacity: isTronCopied ? '1' : '0'
                }}
            >
                Copied
            </span>
            
        </div>
    )
}

export default ProfilePageContainer