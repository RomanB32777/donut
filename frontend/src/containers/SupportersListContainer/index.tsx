import ToggleList from "../../commonComponents/ToggleList"
import LatestDonationsTable from "../../components/SupportersComponents/LatestDonationsTable"
import SupportersMainTable from "../../components/SupportersComponents/SupportersMainTable"

import './styles.sass'

const SupportersListContainer = () => {

    return (
        <div
            className="supporters-list-container"
        >
            <ToggleList
                children={<SupportersMainTable/>}
                title='supporters_toggle_list_first_title'
            />
            <ToggleList
                children={<LatestDonationsTable/>}
                title='supporters_toggle_list_second_title'
            />
        </div>
    )
}

export default SupportersListContainer