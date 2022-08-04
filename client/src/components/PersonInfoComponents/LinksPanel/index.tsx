import { DiscordIcon, FacebookIcon, TwitterIcon, YoutubeIcon } from "../../../icons/icons";

import './styles.sass'

const LinksPanel = (props: {
    twitter: string;
    facebook: string;
    youtube: string;
    discord: string
}) => {

    return (
        <div
            className="person-info-link-panel"
        >
            {
                props.facebook && props.facebook.length>0
                &&
                <a
                    href={props.facebook}
                    className='filled'
                >
                    <FacebookIcon/>
                </a>
            }

            {
                props.youtube && props.youtube.length>0
                &&
                <a
                    href={props.youtube}
                    className='filled'
                >
                    <YoutubeIcon/>
                </a>
            }

            {
                props.twitter && props.twitter.length>0
                &&
                <a
                    href={props.twitter}
                    className='filled'
                >
                    <TwitterIcon/>
                </a>
            }

            {
                props.discord && props.discord.length>0
                &&
                <a
                    href={props.discord}
                    className='filled'
                >
                    <DiscordIcon/>
                </a>
            }

        </div>
    )
}

export default LinksPanel