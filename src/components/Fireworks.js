

import { useEffect, useRef } from 'react'


const huePalette = [239, 241, 331, 226, 300]
const firstBang = './first-bang.wav'
const secondBang = './second-bang.wav'

const settings = {
	0: {
		r1: 1,
		r2: 1,
		d: 200,
		f1: 6,
		f2: 8,
		n: 20,
		vi: 8,
		vf: 2
	},
	1: {
		r1: 2.0,
		r2: 2.5,
		d: 500,
		f1: 6,
		f2: 8,
		n: 50,
		vi: 8,
		vf: 4
	}
}

export default function Fireworks({enabled=false, offset=0, onFinish=null, top=100}) {

	const ctx = useRef()
	const sets = useRef()
	const canvas = useRef()
	const gradient = useRef()
	const fireworks = useRef([])
	const enableFire = useRef(false)

	useEffect(()=>{

		// Getting settings for size and updating canvas size
		sets.current = settings[0]
		if (!window.mobileAndTabletCheck()) {
			addEventListener('resize', updateSizes); 
			sets.current = settings[1]
		}

		//Getting context and initializing sizes
		ctx.current = canvas.current.getContext("2d")
		canvas.current.width = window.innerWidth
		canvas.current.height = canvas.current.scrollHeight

		//Creating background gradient
		const grad = ctx.current.createRadialGradient(window.innerWidth / 2, window.innerHeight, 0, window.innerWidth / 2, window.innerHeight, canvas.current.scrollHeight)
		grad.addColorStop(0, 'rgba(44, 45, 53, 1)')
		grad.addColorStop(1, 'rgba(1,1,1,1)')
		ctx.current.fillStyle = grad
		ctx.current.fillRect(0, 0, window.innerWidth, canvas.current.scrollHeight)

	}, [canvas.current])

	useEffect(()=>{
		if (enabled) {

			animate()
			randomFire()

			return () => {
				if (!window.mobileAndTabletCheck()) {
					removeEventListener('resize', updateSizes)
				}
			}
		}
	}, [enabled])


	function updateSizes() {
		canvas.current.width = window.innerWidth
		canvas.current.height = canvas.current.scrollHeight
	}


	function animate() {
		if (enabled) requestAnimationFrame(animate)
		updateFireworks()
	}

	function updateFireworks() {
		for (var idx in fireworks.current) {
			fireworks.current[idx].update()
			if (fireworks.current[idx].dist >= fireworks.current[idx].expDist) {
				let f = fireworks.current[idx]
				let colIdx = Math.floor(Math.random() * huePalette.length)
				let i = 15
				while(i--) {
					let ang = Math.random() * 180
					let s = Math.random() * 50 + 25
					let l = Math.random() * 50 + 25
					let vel = Math.random() * sets.current.vf
					let color = `hsl(${huePalette[colIdx]}, ${s}%, ${l}%)`
					let firework = new Firework(ctx.current, {
						x: f.x,
						y: f.y,
						ang,
						color,
						dur: 1,
						dur: 2,
						vi: vel,
						r: sets.current.r2,
						gFactor: sets.current.f2,
					})
					fireworks.current.push(firework)			
				}
				fireworks.current.splice(idx, 1)
			}
			else if (fireworks.current[idx].opacity <= 0) {fireworks.current.splice(idx, 1)}
		}
	}

	function randomFire() {
		for (let i = 1; i<=sets.current.n; i++) {
			let x = (Math.random() * 0.8 + 0.1) * window.innerWidth
			let y = window.innerHeight + offset
			let a = (Math.random() * 0.57 + 1) * 70
			setTimeout(()=>singleFire(x,y,a), Math.random() * 5000)
		}
		setTimeout(()=>clearCanvas(), 0)
	}

	function singleFire(x, y, ang) {
		let firework = new Firework(ctx.current, {
			x,
			y,
			ang,
			dur: 2,
			r: sets.current.r1,
			vi: sets.current.vi,
			gFactor: sets.current.f1,
			dist: Math.max(100, Math.random() * top),
		})
		fireworks.current.push(firework)
	}

	async function clearCanvas(alpha=0.5) {
		if (alpha<=1) {
			await new Promise(r=>setTimeout(r, 100))
			let grad = ctx.current.createRadialGradient(window.innerWidth / 2, window.innerHeight, 0, window.innerWidth / 2, window.innerHeight, canvas.current.scrollHeight);
			grad.addColorStop(0, `rgba(44, 45, 53, ${alpha})`)
			grad.addColorStop(1, `rgba(1,1,1, ${alpha})`)
			ctx.current.fillStyle = grad
			ctx.current.fillRect(0, 0, window.innerWidth, canvas.current.scrollHeight)
			clearCanvas(alpha+(2/(8*60)))
		}
		else {
			enabled = false
			if (onFinish) onFinish()
		}
	}

	return (
		<canvas ref={canvas} className='fireworks'>
			
		</canvas>
	)

}

const Firework = function(ctx,  sets={}) {

	this.g = -9.81
	this.color = sets.color??'#fff'					/* color of the firework */
	this.gFactor = sets.gFactor??1 					/* Gravity reduction factor */
	this.ang = sets.ang??90;								/* angle during launch */
	this.vi = sets.vi??8;										/* launch velocity */
	this.expDist = sets.dist??100000;				/* distance before explode */
	this.rad = sets.r??1.5;									/* radius before explosion */
	this.inT = performance.now()						/* initial time */
	this.dist = 0														/* cover distance keeper */
	this.opacity = 1.0											/* initial opacity */
	this.ctx = ctx
	this.x = sets.x??0;
	this.y = sets.y??0;
	this.dur = sets.dur??3
	this.viy = Math.sin(this.ang * (Math.PI / 180)) * this.vi
	this.vix = Math.cos(this.ang * (Math.PI / 180)) * this.vi

	
	this.draw = function() {
		if (this.opacity < 0) {return}
		this.ctx.save();
		this.ctx.globalAlpha = this.opacity
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2, false);
		this.ctx.fillStyle = this.color;
		this.ctx.strokeStyle = "#333";
		this.ctx.stroke();
		this.ctx.fill();
		this.ctx.closePath();
		this.ctx.stroke();		
		this.ctx.restore();
	}

	this.update = function() {
		let deltaT = (performance.now() - this.inT) / 1000;
		this.dy = this.viy + this.g * deltaT / this.gFactor;
		this.dist += Math.sqrt(this.dy**2 + this.vix**2)
		this.y -= this.dy;
		this.x += this.vix;
		this.opacity -= (1 / (this.dur * 60))
		this.draw();
	}
}


window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};