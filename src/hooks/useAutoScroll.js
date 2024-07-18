

import { useState, useRef } from 'react'


export default function useAutoScroll() {

	const int = useRef()
	const scrollRef = useRef()

	function trigger() {
		addEventListener('wheel', clear)
		addEventListener('mousedown', clear)
		addEventListener('touchstart', clear)

		let dur = 180
		let delta = scrollRef.current.offsetHeight / dur
		let i = window.scrollY;
		int.current = setInterval(function() {
			window.scrollTo({ 
				top: i,
				left: 0
			})
			i += delta - i * 1 / dur;
			if (i >= scrollRef.current.offsetHeight - 10) clear();
		}, 1);
	}

	function clear() {
		if (int.current) {
			clearInterval(int.current)
			removeEventListener('wheel', clear)
			removeEventListener('touchstart', clear)
			removeEventListener('mousedown', clear)
		}
	}

	return [ trigger, scrollRef ]

}