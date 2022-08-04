
import { FormattedMessage } from 'react-intl'
import './styles.sass'

import NftPanel from '../../components/NftPanel'
import { useSelector } from 'react-redux'

const NftListContainer = () => {

    const nfts = useSelector( (state: any) => (state.personInfoPage)).data
    const user = useSelector( (state: any) => (state.personInfo)).main_info

    return (
        <div
            className='nft-list-container'
        >
            <span
                className='nft-list-container__title'
            >
                {
                    nfts.data.length>0
                    ?
                    <>
                        <FormattedMessage id='nft_page_title' />
                        {
                            user.person_name && user.person_name.length>0
                            ?
                            user.person_name
                            :
                            user.username
                        }
                    </>
                    :
                    <FormattedMessage id='nft_page_title_none' />
                }
                

            </span>

            <div
                className='nft-list-container__list'
            >
                {
                    nfts.data
                    &&
                    nfts.data.length>0
                    &&
                    nfts.data.reverse().map( (nft: any, nftIndex: any) => (
                        <div
                            key={'nft-list-container__list__panel'+nftIndex}
                            className='nft-list-container__list__panel'
                            style={{
                                marginRight: (nftIndex%4!==3) ? (1170-220*4)/3+'px' : '0px'
                            }}
                        >
                            <NftPanel
                                data={nft}
                            />
                        </div>  
                    ))
                }
            </div>
        </div>
    )
}

export default NftListContainer