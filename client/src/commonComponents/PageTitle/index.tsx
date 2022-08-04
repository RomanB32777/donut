import { FormattedMessage } from "react-intl"

import './styles.sass'

const PageTitle = (
    prop: {
        formatId: string
    }
) => {

    return (
        <div
            className="page-title"
        >
            <span>
                <FormattedMessage id={prop.formatId} />
            </span>
        </div>
    )
}

export default PageTitle