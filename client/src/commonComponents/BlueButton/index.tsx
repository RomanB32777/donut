import { FormattedMessage } from 'react-intl';
import './styles.sass'

const BlueButton = (props: {
    formatId: string;
    onClick: () => void;
    padding: string;
    fontSize: string;
}) => (
    <div
        className="blue-button"
        onClick={props.onClick}
        style={{
            padding: props.padding,
            fontSize: props.fontSize
        }}
    >
        <FormattedMessage id={props.formatId} />
    </div>
)

export default BlueButton