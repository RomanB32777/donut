import { FacebookIcon, InstagramIcon, TwitchIcon, TwitterIcon, YoutubeIcon } from "../../../icons/icons";

import './styles.sass'

const LinksPanel = (props: {
    twitter: string;
    facebook: string;
    youtube: string;
    twitch: string;
    instagram: string;
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
                props.twitch && props.twitch.length>0
                &&
                <a
                    href={props.twitch}
                    className='filled'
                >
                    <TwitchIcon/>
                </a>
            }

{
                props.instagram && props.instagram.length>0
                &&
                <a
                    href={props.instagram}
                    className='filled'
                >
                    <InstagramIcon/>
                </a>
            }

        </div>
    )
}

export default LinksPanel