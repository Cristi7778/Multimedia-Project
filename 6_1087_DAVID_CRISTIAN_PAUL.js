let editor, desen, selectie, color,buttonReset, buttonSaveSVG, lineSize, buttonSavePNG
let shape = document.getElementsByName('shape')
let action = document.getElementsByName('action')
let selected = null
let difx,dify
let mx = 0,
    my = 0
let sx = 0,
    sy = 0
editor = document.querySelector('#editor')
desen = document.querySelector('#desen')
color = document.querySelector('#colors')
buttonSaveSVG = document.querySelector('#saveSVG')
buttonDelete=document.querySelector("#delete")
lineSize = document.querySelector('#size')
buttonReset=document.querySelector("#reset")
buttonSavePNG = document.querySelector('#savePNG')
console.log(editor, selectie, desen)
for(let i=0;i<action.length;i++){
    action[i].addEventListener('change',actionChanged)
}

function checkSelected(shape) {
    let selected
    for (let i = 0; i < shape.length; i++) {
        if (shape[i].checked === true) {
            selected = shape[i].value
            break
        }
    }
    return selected
}
function equalShape(shape1, shape2) {
    if (shape1.tagName != shape2.tagName)
        return false
    else {
        if (shape1.tagName === "ellipse") {
            if (shape1.cx.baseVal.value === shape2.cx.baseVal.value && shape1.cy.baseVal.value === shape2.cy.baseVal.value
                && shape1.rx.baseVal.value === shape2.ry.baseVal.value && shape1.ry.baseVal.value===shape2.ry.baseVal.value)
                return true
        }
        if (shape1.tagName === "line") {
            if (shape1.x1.baseVal.value === shape2.x1.baseVal.value && shape1.y1.baseVal.value === shape2.y1.baseVal.value
                && shape1.x2.baseVal.value === shape2.x2.baseVal.value && shape1.y2.baseVal.value===shape2.y2.baseVal.value)
                return true
        }
        if (shape1.tagName === "rect") {
            if (shape1.x.baseVal.value === shape2.x.baseVal.value && shape1.y.baseVal.value === shape2.y.baseVal.value
                && shape1.height.baseVal.value === shape2.height.baseVal.value && shape1.width.baseVal.value === shape2.width.baseVal.value)
                return true
        }
        return false
    }
}

function setCoordRectangle(elem, x1, y1, x2, y2) {
    elem.setAttribute('x', Math.min(x1, x2))
    elem.setAttribute('y', Math.min(y1, y2))
    elem.setAttribute('width', Math.max(x1, x2) - Math.min(x1, x2))
    elem.setAttribute('height', Math.max(y1, y2) - Math.min(y1, y2))
    elem.setAttribute('fill', color.value)
}

function setCoordLine(elem, x1, y1, x2, y2) {
    elem.setAttribute('x1', x1)
    elem.setAttribute('y1', y1)
    elem.setAttribute('x2', x2)
    elem.setAttribute('y2', y2)
    elem.setAttribute('stroke', color.value)
    elem.setAttribute('stroke-width', lineSize.value)
}

function setCoordEllipse(elem, x1, y1, x2, y2) {
    elem.setAttribute('cx', (x1 + x2) / 2)
    elem.setAttribute('cy', (y1 + y2) / 2)
    elem.setAttribute('rx', Math.abs(x1 - x2))
    elem.setAttribute('ry', Math.abs(y1 - y2))
    elem.setAttribute('fill', color.value)
}

function mouseMove(e) {
    mx = e.x - editor.getBoundingClientRect().x
    my = e.y - editor.getBoundingClientRect().y
    if (checkSelected(action) === 'Draw') {
        if (selectie) {
            selected = checkSelected(shape)
            if (selected === 'Rectangle') {
                setCoordRectangle(selectie, mx, my, sx, sy)
                desen.append(selectie)
            } else {
                if (selected === 'Line') {
                    setCoordLine(selectie, mx, my, sx, sy)
                    desen.append(selectie)
                } else {
                    if (selected === 'Ellipse') {
                        setCoordEllipse(selectie, mx, my, sx, sy)
                        desen.append(selectie)
                    }
                }
            }
        }
    }
    if (checkSelected(action) === 'Move') {
        if (selectie) {
            if (selectie.tagName === 'rect') {
                selectie.x.baseVal.value = mx
                selectie.y.baseVal.value=my
                desen.append(selectie)
            } else {
                if (selectie.tagName === 'line') {
                    setCoordLine(selectie, mx, my, mx+difx, my+dify)
                    desen.append(selectie)
                } else {
                    if (selectie.tagName === 'ellipse') {
                        selectie.cx.baseVal.value =mx
                        selectie.cy.baseVal.value =my
                        desen.append(selectie)
                    }
                }
            }
        }
        console.log(selectie)
    }
}

function mouseDown(e) {
    if (checkSelected(action) === 'Draw') {
        selected = checkSelected(shape)
        if (selected === 'Rectangle') {
            selectie = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'rect',
            )
            sx = mx
            sy = my
            setCoordRectangle(selectie, mx, my, sx, sy)
        } else {
            if (selected === 'Line') {
                selectie = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'line',
                )
                sx = mx
                sy = my
                setCoordLine(selectie, mx, my, sx, sy)
            } else {
                if (selected === 'Ellipse') {
                    selectie = document.createElementNS(
                        'http://www.w3.org/2000/svg',
                        'ellipse',
                    )
                    sx = mx
                    sy = my
                    setCoordEllipse(selectie, mx, my, sx, sy)
                }
            }
        }
    }
    if (checkSelected(action) === 'Move') {
        mx = e.x - editor.getBoundingClientRect().x
        my = e.y - editor.getBoundingClientRect().y
        list = desen.querySelectorAll("rect, ellipse, line")
        for (let i = 0; i < list.length; i++) {
            if (list[i].tagName === "ellipse") {
                let temp = list[i]
                if (Math.abs(((mx - temp.cx.baseVal.value) / temp.rx.baseVal.value) * 2 + ((my - temp.cy.baseVal.value) / temp.ry.baseVal.value) * 2) <= 1) {
                    selectie = temp
                }
            }
            if (list[i].tagName === "rect") {
                let temp = list[i]
                if (mx > temp.x.baseVal.value && mx < temp.x.baseVal.value + temp.width.baseVal.value && my > temp.y.baseVal.value && my < temp.y.baseVal.value + temp.height.baseVal.value) {
                    selectie = temp
                   
                }
            }
            if (list[i].tagName === "line") {
                let temp = list[i]
                if (Math.abs(((mx - temp.x1.baseVal.value) * (temp.y2.baseVal.value - temp.y1.baseVal.value) - (my - temp.y1.baseVal.value) * (temp.x2.baseVal.value - temp.x1.baseVal.value))) <= 1000) {
                    selectie = temp
                    difx = selectie.x1.baseVal.value - selectie.x2.baseVal.value
                    dify = selectie.y1.baseVal.value - selectie.y2.baseVal.value
                }
            }
        }
    }
}

function mouseUp() {
    if (checkSelected(action) === 'Draw') {
        selected = checkSelected(shape)
        if (selected === 'Rectangle') {
            setCoordRectangle(selectie, mx, my, sx, sy)
            desen.append(selectie)

        } else {
            if (selected === 'Line') {
                setCoordLine(selectie,mx,my,sx,sy)
                desen.append(selectie)
            } else {
                if (selected === 'Ellipse') {
                    setCoordEllipse(selectie, mx, my, sx, sy)
                    desen.append(selectie)
                }
            }
        }
        selectie = null
    }
    if (checkSelected(action) === 'Move') {
        desen.append(selectie)
        selectie=null
    }

}
function mouseClick(e) {
    if (checkSelected(action) ==="Select") {
        mx = e.x - editor.getBoundingClientRect().x
        my = e.y - editor.getBoundingClientRect().y
        list = desen.querySelectorAll("rect, ellipse, line")
        for (let i = 0; i < list.length; i++) {
            if (list[i].tagName === "ellipse") {
                let temp = list[i]
                if (Math.abs(((mx - temp.cx.baseVal.value) / temp.rx.baseVal.value) * 2 + ((my - temp.cy.baseVal.value) / temp.ry.baseVal.value) * 2 )<= 1) {
                    selectie = temp
                }
            }
            if (list[i].tagName === "rect") {
                let temp = list[i]
                if (mx > temp.x.baseVal.value && mx < temp.x.baseVal.value + temp.width.baseVal.value && my > temp.y.baseVal.value && my < temp.y.baseVal.value + temp.height.baseVal.value) {
                    selectie = temp
                }
            }
            if (list[i].tagName === "line") {
                let temp = list[i]
                if (Math.abs(((mx - temp.x1.baseVal.value) * (temp.y2.baseVal.value - temp.y1.baseVal.value) - (my - temp.y1.baseVal.value) * (temp.x2.baseVal.value - temp.x1.baseVal.value))) <= 1000) {
                    selectie = temp
                }
            }
        }
    }
}
function colorChanged() {
    if (selectie) {
        if (selectie.tagName === "line")
            selectie.setAttribute('stroke', color.value)
        else
            selectie.setAttribute("fill", color.value)
    }
    if(color.value==="red"){
        color.style.backgroundColor="red"
        color.style.color="black"
    }
    if(color.value==="blue"){
        color.style.backgroundColor="blue"
        color.style.color="white"
    }
    if(color.value==="black"){
        color.style.backgroundColor="black"
        color.style.color="white"
    }
    if(color.value==="white"){
        color.style.backgroundColor="white"
        color.style.color="black"
    }
    if(color.value==="pink"){
        color.style.backgroundColor="pink"
        color.style.color="black"
    }
    if(color.value==="maroon"){
        color.style.backgroundColor="maroon"
        color.style.color="white"
    }
    if(color.value==="green"){
        color.style.backgroundColor="green"
        color.style.color="black"
    }
}
function actionChanged() {
    selectie=null
}
function sizeChanged() {
    if (selectie) {
        if (selectie.tagName == "line") {
            selectie.setAttribute('stroke-width', lineSize.value)
        }
    }
}
function deleteSelection(){
    if (selectie) {
        desen.removeChild(selectie)
        selectie = null
    }
}

function saveSVG() {
    let svgText = document.querySelector('svg').outerHTML
    svgText = svgText.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"')
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)
    const downloadLink = document.createElement('a')
    downloadLink.href = svgUrl
    downloadLink.download = 'drawing.svg'
    downloadLink.click()
}
function savePNG() {
    let serializer = new XMLSerializer()
    let source = serializer.serializeToString(editor)
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')
    let img = new Image()
    let svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    let url = URL.createObjectURL(svgBlob)
    img.onload = function () {
        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0)
        let pngUrl = canvas.toDataURL('image/png')
        let downloadLink = document.createElement('a')
        downloadLink.href = pngUrl
        downloadLink.download = "image.png"
        downloadLink.click()
    }
    img.src = url
}
function reset() {
    let list = desen.querySelectorAll("line,rect,ellipse")
    for (let i = 0; i < list.length; i++) {
        desen.removeChild(list[i])
    }
}

    editor.addEventListener('mousemove', mouseMove)
    editor.addEventListener('mouseup', mouseUp)
    editor.addEventListener('mousedown', mouseDown)
    editor.addEventListener("click", mouseClick)
    buttonSaveSVG.addEventListener('click', saveSVG)
    buttonSavePNG.addEventListener('click', savePNG)
    buttonDelete.addEventListener('click', deleteSelection)
    buttonReset.addEventListener('click', reset)
    color.addEventListener("change", colorChanged)
    lineSize.addEventListener("change", sizeChanged)

    window.onbeforeunload = function () {
        let storage = ""
        list = desen.querySelectorAll("rect, ellipse, line")
        for (let i = 0; i < list.length; i++) {
            if (i > 0) storage += ","
            storage += list[i].tagName += ","
            if (list[i].tagName === "ellipse") {
                storage += list[i].cx.baseVal.value
                storage += ","
                storage += list[i].cy.baseVal.value
                storage += ","
                storage += list[i].rx.baseVal.value
                storage += ","
                storage += list[i].ry.baseVal.value
                storage += ","
                storage += list[i].getAttribute("fill")
            }

            if (list[i].tagName === "rect") {
                storage += list[i].x.baseVal.value
                storage += ","
                storage += list[i].y.baseVal.value
                storage += ","
                storage += list[i].width.baseVal.value
                storage += ","
                storage += list[i].height.baseVal.value
                storage += ","
                storage += list[i].getAttribute("fill")
            }

            if (list[i].tagName === "line") {
                storage += list[i].x1.baseVal.value
                storage += ","
                storage += list[i].y1.baseVal.value
                storage += ","
                storage += list[i].x2.baseVal.value
                storage += ","
                storage += list[i].y2.baseVal.value
                storage += ","
                storage += list[i].getAttribute('stroke')
                storage += ","
                storage+=list[i].getAttribute('stroke-width')
            }
        }
        localStorage.setItem("storage", storage)
    }
    window.onload = function () {
        let storage = localStorage.getItem("storage")
        let myArray = storage.split(",")
        let i = 0
        while (i < myArray.length) {
            if (myArray[i] === "line") {
                let nou = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'line',
                )
                setCoordLine(nou, parseFloat(myArray[++i]), parseFloat(myArray[++i]), parseFloat(myArray[++i]), parseFloat(myArray[++i]))
                nou.setAttribute('stroke', myArray[++i])
                nou.setAttribute('stroke-width', myArray[++i])
                desen.append(nou)
            }
            if (myArray[i] === "rect") {
                let nou = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'rect',
                )
                nou.setAttribute("x", parseFloat(myArray[++i]))
                nou.setAttribute("y", parseFloat(myArray[++i]))
                nou.setAttribute("width", parseFloat(myArray[++i]))
                nou.setAttribute("height", parseFloat(myArray[++i]))
                nou.setAttribute("fill",myArray[++i])
                desen.append(nou)
            }
            if (myArray[i] === "ellipse") {
                let nou = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'ellipse',
                )
                nou.setAttribute("cx",parseFloat(myArray[++i]))
                nou.setAttribute("cy",parseFloat(myArray[++i]))
                nou.setAttribute("rx",parseFloat(myArray[++i]))
                nou.setAttribute("ry", parseFloat(myArray[++i]))
                nou.setAttribute("fill", myArray[++i])
                desen.append(nou)
            }

            i++
        }
    };
