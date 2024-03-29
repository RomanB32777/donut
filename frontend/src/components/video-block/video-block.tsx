import { FC } from 'react'
import clsx from 'clsx'
import { IVideoBlock } from './video-block.interface'
import './styles.sass'

const VideoBlock: FC<IVideoBlock> = ({ link, modificator }) => {
	return (
		<div className={clsx('video', modificator)}>
			<iframe
				width="530"
				height="315"
				src={link}
				title="YouTube video player"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				frameBorder="0"
				allowFullScreen
			/>
		</div>
	)
}
export default VideoBlock
