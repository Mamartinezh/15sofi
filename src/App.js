

import SVGText from './components/SVGText'
import Fireworks from './components/Fireworks'


export default function App() {

	return (
		<div className='app'>
			<Fireworks />
			<div className='front'>
				<div className='front-bg'></div>
				<img src='./vip_pass.png' />
				<div className='banner'></div>
			</div>
			<div className='back'>
				<div className='head gradient-text solid-border'>
					<div className='border-dots'></div>
					VIP RECEPTION INVITATION
				</div>
				<div className='title-name solid-border'>
					<div className='border-dots'></div>
					<SVGText />
					<h2 className='gradient-text'>MIS 15'S</h2>
				</div>
				<div className='info solid-border'>
					<div className='border-dots'></div>
					<h4 className='gradient-text'>VIERNES</h4>
					<div className='info--date'>
						<div className='box gradient-text gradient-border'>
							AGOSTO
						</div>
						<h3 className='gradient-text'>23</h3>
						<div className='box gradient-text gradient-border'>
							7:00 PM
						</div>						
					</div>
					<p className='gradient-text'>
						GALILEA CAMPESTRE<br/>
						SECTOR SAJONIA<br/>
						RIONEGRO - ANTIOQUIA<br/>
					</p>
					<p className='info--dress-code'>
						<span className='gradient-text'>DRESS<br/>CODE</span>
						<span className='gradient-text'>BLANCO<br/>NEGRO</span>
					</p>
					<img src='./dress-code.png' /> 
					<div className='info--buttons gradient-text'>
						<a 
							href='https://wa.link/2busyo' 
							target='self'>
							<i className="fa-brands fa-whatsapp"></i>
							&emsp;CONFIRMA AQUÍ
						</a>
						<a 
							href='https://maps.app.goo.gl/kasF8y7YzF6CLaFM7' 
							target='self'>
							<i className="fa-solid fa-location-dot"></i>
							&emsp;¿CÓMO LLEGAR?
						</a>
					</div>
					<div className='bottom-border solid-border'>
						<div className='border-dots'></div>
					</div>
				</div>
			</div>
		</div>
	)
}