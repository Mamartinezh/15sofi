
import { useState, useEffect, useRef } from 'react'

export default function Texture({onLoad, maxSize=60, nRows=6, dur=1.5, del=0.15}) {

	const maxRef = useRef(maxSize)
	const [ size, setSize ] = useState(maxSize)
	const [ links, setLinks ] = useState(0)
	const [ sFactor, setSFactor ] = useState(1)
	const [ isMounted, setIsMounted ] = useState(false)

	useEffect(()=>{

		addEventListener('resize', updateLinks)

		updateLinks()

		if (!isMounted) setIsMounted(true)

		return () => removeEventListener('resize', updateLinks)

	}, [])


	function updateLinks() {

		let iw = window.innerWidth

		maxRef.current = maxSize
		// if (iw < 1000) maxRef.current = 55
		// if (iw < 750) maxRef.current = 40
		// if (iw < 400) maxRef.current = 20
		// if (iw < 300) maxRef.current = 15

		let ratio = window.innerWidth / maxRef.current
		let plus = (maxRef.current * Math.cos(45 * Math.PI / 180) - maxRef.current * 0.5) * 2

		setLinks(Math.floor(ratio) * nRows)
		setSFactor((window.innerWidth - plus) / window.innerWidth)
		setSize(maxRef.current + (ratio % 1) * (maxRef.current - 4) / Math.floor(ratio))

		if (!isMounted) setTimeout(()=>{
			onLoad()
		}, (dur + del * Math.floor(ratio) / 2) * 1000)

	}

	return (
		<div 
			style={{
				'--w': size,
				'--s': sFactor
			}}
			className='texture-container'>
			{[...Array(links).keys()].map(n=>
				{
					let nLk = links / nRows
					let mod = n % nLk
					let mid = nLk / 2
					let dFc = mod <= mid ? mod : (nLk - (mid % 1 ? 1 : 0)) - mod
					return <div
						style={{
							'--dur': dur,
							'--del': del * dFc,
							'--i': links / nRows
						}}
						className='link gradient-text'>
						<div></div>		
					</div>					
				}

			)}
		</div>
	)

}