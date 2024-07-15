

import { useEffect, useRef } from 'react'


const huePalette = [239, 241, 331, 226, 300]
const firstBang = './first-bang.wav'
const secondBang = './second-bang.wav'

const settings = {
	0: {
		r: 3,
		d: 800,
		f: 6,
		n: 40
	},
	1: {
		r: 2,
		d: 400,
		f: 8,
		n: 30
	},
	2: {
		r: 1,
		d: 250,
		f: 10,
		n: 20
	}
}

export default function Fireworks() {

	const sId = useRef()
	const ctx = useRef()
	const canvas = useRef()
	const gradient = useRef()
	const fireworks = useRef([])

	useEffect(()=>{

		//Configuring settings
		sId.current = window.innerHeight < 750 ? 2 : window.innerHeight < 1000 ? 1 : 0

		//Getting context and initializing sizes
		ctx.current = canvas.current.getContext("2d")
		canvas.current.width = window.innerWidth
		canvas.current.height = canvas.current.scrollHeight

		//Creating background gradient
		const grad = ctx.current.createRadialGradient(window.innerWidth / 2, window.innerHeight, 0, window.innerWidth / 2, window.innerHeight, canvas.current.scrollHeight)
		grad.addColorStop(0, 'rgba(54, 55, 63, 1)')
		grad.addColorStop(1, 'rgba(1,1,1,1)')
		ctx.current.fillStyle = grad
		ctx.current.fillRect(0, 0, window.innerWidth, canvas.current.scrollHeight)

		//Creating gradient for animations clearing
		gradient.current = ctx.current.createRadialGradient(window.innerWidth / 2, window.innerHeight, 0, window.innerWidth / 2, window.innerHeight, canvas.current.scrollHeight);
		gradient.current.addColorStop(0, 'rgba(54, 55, 63, 0.05)')
		gradient.current.addColorStop(1, 'rgba(1,1,1,0.05)')
		animate()
		randomFire()

		console.log(window.mobileAndTabletCheck())

		if (!window.mobileAndTabletCheck()) {
			addEventListener('resize', updateSizes); 
		}

		addEventListener('click', fire)

		return () => {
			removeEventListener('click', fire)
			if (!window.mobileAndTabletCheck()) {
				removeEventListener('resize', updateSizes)
			}
		}

	}, [canvas.current])


	function updateSizes() {
		canvas.current.width = window.innerWidth
		canvas.current.height = canvas.current.scrollHeight
	}


	function animate() {
		requestAnimationFrame(animate)

		ctx.current.fillStyle = gradient.current
		ctx.current.fillRect(0, 0, window.innerWidth, canvas.current.scrollHeight)	

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
					let vel = Math.random() * 4
					let s = Math.random() * 50 + 25
					let l = Math.random() * 50 + 25
					let color = `hsl(${huePalette[colIdx]}, ${s}%, ${l}%)`
					let firework = new Firework(ctx.current, f.x, f.y, ang, vel, 1000000, color, 10, 0, settings[sId.current])
					fireworks.current.push(firework)			
				}
				fireworks.current.splice(idx, 1)
			}
			else if (fireworks.current[idx].opacity <= 0) {fireworks.current.splice(idx, 1)}
		}
	}

	function fire(e) {
		let cx = e.clientX 
		let cy = e.clientY + window.scrollY
		cx = cx > window.innerWidth / 2 ? window.innerWidth : 0
		let a = Math.random() * 35 + 45
		a =  cx===0 ? a : a + 45
		singleFire(cx, cy, a)
	}

	function randomFire() {
		for (let i = 1; i<=settings[sId.current].n; i++) {
			let x = Math.floor(Math.random() * 2) ? 0 : window.innerWidth
			let y = Math.random() *  canvas.current.scrollHeight
			let a = Math.random() * 35 + 45
			a =  x===0 ? a : a + 45
			setTimeout(()=>singleFire(x,y,a), Math.random() * 15000)
		}
	}

	function singleFire(x, y, a) {
		let firework = new Firework(ctx.current, x, y, a, 10, null, "#fff", 6, 0, settings[sId.current])
		fireworks.current.push(firework)
	}

	return (
		<canvas ref={canvas} className='fireworks'>
			
		</canvas>
	)

}



const Firework = function(ctx, x, y, ang, vi, expDist, color, gFactor, sample, sets={}) {

	this.g = -9.81
	this.color = color					/* color of the firework */
	this.gFactor = sets.f??gFactor		/* gravity reduction factor */
	this.ang = ang;						/* angle during launch */
	this.vi = vi;						/* launch velocity */
	this.expDist = expDist??sets.d;		/* distance before explode */
	this.rad = sets.r??1;				/* radius before explosion */
	this.inT = performance.now()		/* initial time */
	this.dist = 0						/* cover distance keeper */
	this.opacity = 1					/* initial opacity */
	this.ctx = ctx
	this.x = x;
	this.y = y;
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
		this.opacity -= 0.006
		this.draw();
	}
}


window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};