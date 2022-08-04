import { FormattedMessage } from 'react-intl'

import './styles.sass'
import { useDispatch, useSelector } from 'react-redux'
import { getPersonInfoPage } from '../../../store/types/PersonInfo'
import { useLocation } from 'react-router'

const NavigatingPanel = () => {

    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const personInfoPage = useSelector( (state: any) => (state.personInfoPage))

    return (
        <div
            className='navigating-panel'
        >
            <span
                className={personInfoPage.page === 'supporters' ? 'choosen' : ''}
                onClick={() => dispatch(getPersonInfoPage({page: 'supporters', username: pathname.slice(pathname.indexOf('@'))}))}
            >
                <FormattedMessage id='profile_info_navigating_supporters' />
            </span>
            <span
                className={personInfoPage.page === 'nft' ? 'choosen' : ''}
                onClick={() => dispatch(getPersonInfoPage({page: 'nft', username: pathname.slice(pathname.indexOf('@'))}))}
            >
                <FormattedMessage id='profile_info_navigating_nft' />
            </span>
        </div>
    )
}

export default NavigatingPanel