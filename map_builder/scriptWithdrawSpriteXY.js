// Script for copyinng sprites location on spritecow.com


(function(){
	document.querySelector('.canvas-view .canvas-cell canvas').addEventListener('click', ()=>{
		setTimeout(()=>{
			let txt = document.getElementsByTagName('code')[0].textContent
			txt = txt.split('no-repeat')[1].split(' ')
			txt = txt.map(ele=>{
				const retArr =[]
				ele.split('').forEach(char => {
					const check = parseInt(char)
					if (!isNaN(check) && typeof check === 'number'){
						retArr.push(check)
					}
				})
				return retArr.join('')	
			})
			txt = txt.filter(ele => {
				if (ele) {
					return ele
				}
			})
			if (txt.length === 4){
				const x = parseInt(txt[0])
				const y = parseInt(txt[1])
				const l = parseInt(txt[2])
				const h = parseInt(txt[3])
				const obj = [x, y, l, h]
				if (!window.canvasPositions){
					window.canvasPositions = {}
				}
				const ys = Object.keys(window.canvasPositions)
				if (ys.length){
					let done = false
					ys.forEach( curY => {
						const diff = curY - y
						if (diff < 10 && diff > -10){
							window.canvasPositions[curY].push(obj)
							done = true
						}
					})
					if (!done){
						const name = prompt('Nazwa danego state\'a')
						window.canvasPositions[y]=[]
						window.canvasPositions[y].push(name)
						window.canvasPositions[y].push(obj)
					}
				} else {
					const name = prompt('Nazwa danego state\'a')
					window.canvasPositions[y]=[]
					window.canvasPositions[y].push(name)
					window.canvasPositions[y].push(obj)
				}
			}
		},500)

	})
	document.addEventListener('keypress', event => {	
		if (event.key == ' '){ //spacja
			console.log(window.canvasPositions)	
		}
	})
})()
