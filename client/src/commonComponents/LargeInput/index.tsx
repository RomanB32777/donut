import { FormattedMessage, useIntl } from "react-intl"

import './styles.sass'

const LargeInput = (props: {
    title: string;
    subtitle?: string;
    placeholder?: string;
    isRedDot?: boolean;
    isTextarea?: boolean;
    onChange: (event: any) => void;
}) => {

    const intl = useIntl()

    return (
        <div
            className="large-input"
        >
            <span
                className="large-input__title"
            >
                <FormattedMessage id={props.title} />
                {
                    props.isRedDot
                    &&
                    <span>*</span>
                }
            </span>

            {
                props.subtitle
                &&
                <span
                    className="large-input__subtitle"
                >
                    <FormattedMessage id={props.subtitle} />
                </span>
            }

            {
                (props.title !== 'create_badge_form_icon_title')
                &&
                (props.isTextarea
                ?   
                <textarea
                    onChange={props.onChange}
                    placeholder={intl.formatMessage({id: props.placeholder || ''})}
                />
                :
                <input
                    type='text'
                    onChange={props.onChange}
                    placeholder={intl.formatMessage({id: props.placeholder || ''})}
                />
                )
            }

        </div>
    )
}

export default LargeInput