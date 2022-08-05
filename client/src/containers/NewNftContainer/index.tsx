
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import BlueButton from '../../commonComponents/BlueButton'
import LargeInput from '../../commonComponents/LargeInput'
import PageTitle from '../../commonComponents/PageTitle'
import getTronWallet from '../../functions/getTronWallet'
import axiosClient from '../../axiosClient'
import './styles.sass'
import { LargeImageIcon } from '../../icons/icons'
import postData from '../../functions/postData'
import { useNavigate } from 'react-router'
import routes from '../../routes'

const NewNftContainer = () => {

    const navigate = useNavigate()

    const tron_wallet = getTronWallet()

    const [form, setForm] = useState({
        nft_name: '',
        nft_desc: '',
        nft_link: '',
    })
    const [file, setFile] = useState<any>();
    const [fileName, setFileName] = useState("");
    const [imagebase64, setImagebase84] = useState<any>('')

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
            setFileName(ev.target.files[0].name);
        }
    };

    const createNft = async () => {
        const res: any = await fetch(
               "/api/nft/create", {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({...form, tron_token: tron_wallet}) 
            }
        )
        const result = await res.json()
        if (result) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", fileName);

            await axiosClient.post(
                '/api/nft/create/image/'+result.nft.id,
                formData
            ).then( res => {
                if (res) {
                    navigate(routes.nft)
                }
            })
        }


        if (fileName.length > 0) {

        }

        setFileName('')
        setFile(null)
    }
    
    return (
        <div
            className='new-nft-container'
        >
            <PageTitle
                formatId='new_nft_page_title'
            />
            <div
                className='new-nft-container__form'
            >
                <div
                    className='new-nft-container__form__input-wrapper'
                >
                    <span
                        className='title'
                    >
                        <FormattedMessage id='new_nft_page_file_load_title' />
                    </span>
                    <span
                        className='subtitle'
                    >
                        <FormattedMessage id='new_nft_page_file_load_subtitle' />
                    </span>
                    <div>
                        {
                            fileName.length>0
                            ?
                            <img src={imagebase64} />
                            :
                            <LargeImageIcon/>
                        }
                        
                        <input 
                            type='file'
                            onChange={saveFile}
                        />
                    </div>
                </div>
                <LargeInput
                    title='new_nft_page_form_input_title_name'
                    placeholder='new_nft_page_form_input_placeholder_name'
                    isRedDot={true}
                    isTextarea={false}
                    onChange={(event) => setForm({...form, nft_name: event.target.value})}
                />
                <LargeInput
                    title='new_nft_page_form_input_title_desc'
                    placeholder='new_nft_page_form_input_placeholder_desc'
                    isRedDot={true}
                    isTextarea={true}
                    onChange={(event) => setForm({...form, nft_desc: event.target.value})}
                />
                <LargeInput
                    title='new_nft_page_form_input_title_link'
                    subtitle='new_nft_page_form_input_subtitle_link'
                    placeholder='new_nft_page_form_input_placeholder_link'
                    isRedDot={true}
                    isTextarea={false}
                    onChange={(event) => setForm({...form, nft_link: event.target.value})}
                />

                {
                    <div
                        className="profile-page__save-button"
                        style={{
                            opacity: 
                                (
                                    form.nft_desc.length>0
                                    &&
                                    form.nft_name.length>0
                                    &&
                                    form.nft_link.length>0
                                    &&
                                    form.nft_link.includes('https://')
                                    &&
                                    imagebase64.length>0
                                )
                                ?
                                '1'
                                :
                                '0'
                        }}
                    >
                        <BlueButton
                            formatId="new_nft_page_button"
                            padding='6px 50px'
                            onClick={() => createNft()}
                            fontSize='18px'
                        />
                    </div>
                }
            </div>

        </div>
    )
}

export default NewNftContainer