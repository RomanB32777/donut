
import { FormattedMessage } from 'react-intl'
import './styles.sass'

const Footer = () => {

    return (
        <div
            className='footer'
        >
            <span>
                <FormattedMessage id='footer' />
            </span>
        </div>
    )
}

export default Footer