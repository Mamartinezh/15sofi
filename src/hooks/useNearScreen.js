

import { useState, useEffect, useRef } from 'react'

export default function useNearScreen(scroll) {

	const [ isVisible, setIsVisible ] = useState(false)
	const lazyRef = useRef()

	useEffect(()=>{
		if (scroll) {
			checkVisibility()
			addEventListener('scroll', checkVisibility)
			return () => removeEventListener('scroll', checkVisibility)
		}

		let observer

		const onChange = (entries, observer) => {
			const el = entries[0]
			if (el.isIntersecting) {
				setIsVisible(true)
				observer.disconnect()
			}
		}

		Promise.resolve(()=>{
			IntersectionObserver !== 'undefined' 
			? IntersectionObserver 
			: import('intersection-observer')
		}).then(()=>{
			observer = new IntersectionObserver(onChange, {
				rootMargin: '300px'
			})
			observer.observe(lazyRef.current)
		})

		return () => observer && observer.disconnect()
	}, [])

	function checkVisibility() {
		var rect = lazyRef.current.getBoundingClientRect();
		if (rect.top + document.documentElement.scrollTop <= window.scrollY + window.innerHeight) {
			removeEventListener('scroll', checkVisibility)
			setIsVisible(true)
		}
	}

	return [ isVisible, lazyRef ]

}