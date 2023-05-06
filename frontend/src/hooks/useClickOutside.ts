import { RefObject, useEffect } from 'react'

type AnyEvent = MouseEvent | TouchEvent

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
	isActive: boolean,
	ref: RefObject<T>,
	handler: (event: AnyEvent) => void,
	specialClasses?: string[]
) {
	useEffect(() => {
		if (!isActive) return

		const listener = (event: AnyEvent) => {
			const el = ref?.current
			// Do nothing if clicking ref's element or descendent elements
			const target = event.target
			if (
				!el ||
				(el.contains(target as Node) && !(event?.target as HTMLElement)?.dataset.blur) ||
				(specialClasses?.length &&
					Array.from((target as HTMLElement).classList)?.some((classItem) =>
						specialClasses.includes(classItem)
					))
			) {
				return
			}

			handler(event)
		}

		document.addEventListener(`click`, listener)
		// document.addEventListener(`touchstart`, listener)

		return () => {
			document.removeEventListener(`click`, listener)
			// document.removeEventListener(`touchstart`, listener)
		}

		// Reload only if ref or handler changes
	}, [ref, handler, isActive])
}

export default useOnClickOutside
