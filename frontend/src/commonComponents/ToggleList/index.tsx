import { ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";
import { SmallToggleListArrowIcon } from "../../icons/icons";

import './styles.sass'

const ToggleList = (props: {
    children: ReactNode;
    title: string;
}) => {

    const [isOpened, setIsOpened] = useState<boolean>(true)

    const toggleOpened = () => {
        if (isOpened) {
            setIsOpened(false)
        } else {
            setIsOpened(true)
        }
    }

    return (
        <div
            className="toggle-list"
        >
            <div
                className="toggle-list__header"
                onClick={toggleOpened}
            >
                <span>
                    <FormattedMessage id={props.title} />
                </span>
                <div
                    className={`icon ${isOpened && 'rotated'}`}
                >
                    <SmallToggleListArrowIcon/>
                </div>
            </div>
            <div
                className="toggle-list__component"
                style={{
                    maxHeight: isOpened ? '400px' : '0px'
                }}
            >
                {
                    props.children
                }
            </div>
        </div>
    )
}

export default ToggleList