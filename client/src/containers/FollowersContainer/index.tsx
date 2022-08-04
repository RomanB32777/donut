import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import BlueButton from "../../commonComponents/BlueButton"
import PageTitle from "../../commonComponents/PageTitle"
import routes from "../../routes"

import './styles.sass'

const FollowersContainer = () => {

    const navigate = useNavigate()

    const user = useSelector( (state: any) => (state.user))

    const [data, setData] = useState<any>([
        // {
        //     backer_username: '@jfvfajfdosijji34joi3'
        // },
        // {
        //     backer_username: '@jfvfajfdosijji34joi3'
        // },
        // {
        //     backer_username: '@jfvfajfdosijji34joi3'
        // },
        // {
        //     backer_username: '@jfvfajfdosijji34joi3'
        // },
        // {
        //     backer_username: '@jfvfajfdosijji34joi3'
        // },
        // {
        //     backer_username: '@jfvfajfdosijji34joi3'
        // },
        // {
        //     backer_username: '@jfvfajfdosijji34joi3'
        // },
        // {
        //     backer_username: '@jfvfajfdosijji34joi3'
        // },
        // {
        //     backer_username: '@jfvfajfdosijji34joi3'
        // },
        // {
        //     backer_username: '@jfvfajfdosijji34joi3'
        // },
    ])

    const getData = async () => {
        if (user && user.username && user.username.length>0) {
            const res = await fetch('http://localhost:8080' +  '/api/user/get-followers/'+user.username)
            if (res.status === 200) {
                const result = await res.json()
                setData(result)
            }
        }
    }

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            className="followers-container"
        >
            <PageTitle
                formatId="page_title_followers"
            />
            <div
                className="followers-container__list"
            >
                {
                    (data
                    &&
                    data.length>0)
                    ?
                    data.map( (follower: any, followerIndex: number) => {
                        console.log(follower)
                        return (
                        <div
                            key={"followers-container__list__panel"+followerIndex}
                            className="followers-container__list__panel"
                        >
                            {
                                follower.backer_username
                            }
                        </div>
                    )})
                    :
                    <div
                        className="followers-container__list__message"
                    >
                        <span
                            className="title"
                        >
                            <FormattedMessage id='followers_page_message_title' />
                        </span>
                    </div>
                }
            </div>
        </div>
    )
}

export default FollowersContainer