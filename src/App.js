

import SVGText from './components/SVGText'
import Texture from './components/Texture'
import Fireworks from './components/Fireworks'

import Fade from 'react-reveal/Fade'
import { useState, useRef } from 'react'
import useAutoScroll from './hooks/useAutoScroll'

export default function App() {

	const [ scrollTrigger, scrollRef ] = useAutoScroll()
	const [ textureIsLoaded, setTextureIsLoaded ] = useState(false)

	return (
		<div className='app'>
			<Fireworks 
				offset={0}
				top={window.innerHeight}
				enabled={textureIsLoaded}
			/>
				
			<div ref={scrollRef} className='front'>
				<Texture 
					onLoad={e=>setTextureIsLoaded(true)} 
				 />
				<img
					onClick={scrollTrigger}
					src='./vip_pass.png'
					className={`${textureIsLoaded?'show':''}`} 
				 />
			</div>
			<div className='back'>
				<Fade>
				<div
					className='head gradient-text solid-border'>
					<div className='border-dots'></div>
					VIP RECEPTION INVITATION
				</div>
				</Fade>
				<Fade>
				<div className='title-name solid-border'>
					<div className='border-dots'></div>
					<SVGText />
					<h2 className='gradient-text'>MIS 15'S</h2>
				</div>
				</Fade>
				{/*<Fade>*/}
				<div className='info solid-border'>
					<div className='border-dots'></div>
					<Fade>
					<h4 className='gradient-text'>VIERNES</h4>
					<div className='info--date'>
						<div className='box gradient-text gradient-border'>
							AGOSTO
						</div>
						<h3 
							className='gradient-text'>23</h3>
						<div 
							className='box gradient-text gradient-border'>
							7:00 PM
						</div>						
					</div>
					</Fade>
					<Fade>
					<p className='gradient-text'>
						GALILEA CAMPESTRE<br/>
						SECTOR SAJONIA<br/>
						RIONEGRO - ANTIOQUIA<br/>
					</p>
					</Fade>
					<Fade>
					<p className='gradient-text'>
						<i className="fa-regular fa-envelope"></i>
						&emsp;LLUVIA DE SOBRES
					</p>
					<p className='info--dress-code'>
						<span 
							className='gradient-text'
						>
							DRESS<br/>CODE
						</span>
						<span 
							className='gradient-text'
						>
							BLANCO<br/>NEGRO
						</span>
					</p>
					<img src='./dress-code.png' /> 
					</Fade>
					<Fade>
					<div className='info--buttons gradient-text'>
						<a 
							href='https://wa.link/2busyo' 
							target='self'
						>
							<i className="fa-brands fa-whatsapp"></i>
							CONFIRMA AQUÍ
						</a>
						<a 
							href='https://maps.app.goo.gl/kasF8y7YzF6CLaFM7' 
							target='self'
						>
							<i className="fa-solid fa-location-dot"></i>
							¿CÓMO LLEGAR?
						</a>
					</div>
					<div className='bottom-border solid-border'>
						<div className='border-dots'></div>
					</div>
					</Fade>
				</div>
				{/*</Fade>*/}
			</div>
		</div>
	)
}