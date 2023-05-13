import React, { RefObject, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { DownOutlined } from '@ant-design/icons'
import useOnClickOutside from 'hooks/useClickOutside'
import useWindowDimensions from 'hooks/useWindowDimensions'
import './styles.sass'

interface ISelectComponent<T> {
	title: React.ReactNode
	list: T[]
	selected?: T
	styles?: React.CSSProperties
	headerList?: React.ReactNode
	footerList?: React.ReactNode
	modificator?: string
	listModificator?: string
	listItemModificator?: string
	listWrapperModificator?: string
	selectItem: (item: T) => void
	renderOption?: (item: T) => React.ReactNode
}

const SelectComponent = <T,>({
	title,
	list,
	styles,
	selected,
	headerList,
	footerList,
	modificator,
	listModificator,
	listItemModificator,
	listWrapperModificator,
	selectItem,
	renderOption,
}: React.PropsWithChildren<ISelectComponent<T>>) => {
	const blockRef = useRef(null)
	const { width } = useWindowDimensions()
	const [isOpenSelect, setOpenSelect] = useState(false)

	const selectRoot = document.getElementById('select-root')

	const selectHandler = () => setOpenSelect((prev) => !prev)

	const itemHandler = (selected: T) => {
		setOpenSelect(false)
		selectItem(selected)
	}

	const notSelectedElementsHandler = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()

	useOnClickOutside(isOpenSelect, blockRef, selectHandler)

	const listStyles = useMemo(() => {
		const refCurrent = blockRef as RefObject<HTMLElement>

		if (isOpenSelect && refCurrent && width) {
			const elInfo = refCurrent.current?.getBoundingClientRect()
			if (elInfo) {
				const { top, left, height, width: widthEl } = elInfo
				return {
					top: window.pageYOffset + top + height + 5,
					left,
					width: widthEl,
				}
			}
		}
		return {}
	}, [isOpenSelect, width])

	return (
		<div className={clsx('select', modificator)} style={styles} ref={blockRef}>
			<div className="block" onClick={selectHandler}>
				<div className="title">{title}</div>
				<div
					className={clsx('icon', 'icon-arrow', {
						rotated: isOpenSelect,
					})}
				>
					<DownOutlined />
				</div>
			</div>
			{isOpenSelect &&
				selectRoot &&
				createPortal(
					<div className={clsx('list-wrapper fadeIn', listWrapperModificator)} style={listStyles}>
						<div className="list-content">
							<div onClick={notSelectedElementsHandler}>{headerList}</div>
							<div className={clsx('list', listModificator)}>
								{list.map((item, key) => (
									<div
										className={clsx('list-item', listItemModificator, {
											active: [title, selected].includes(item),
										})}
										key={key}
										onClick={() => itemHandler(item)}
									>
										{renderOption ? renderOption(item) : (item as React.ReactNode)}
									</div>
								))}
							</div>
							<div onClick={notSelectedElementsHandler}>{footerList}</div>
						</div>
					</div>,
					selectRoot
				)}
		</div>
	)
}

export default SelectComponent
