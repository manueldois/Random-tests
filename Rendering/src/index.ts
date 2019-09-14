import './styles.scss'
import { Timeline, setTimeoutPromise, rgbToHex, randomRGB } from './util'
import { IDomSections, IDomSectionElements } from './interfaces'
import * as PIXI from 'pixi.js'
console.log('STARTING RENDERING TEST')

/*
    Demo to test different methods of rendering a GOL world to a canvas.
    To achieve a downsample, simply skip some cells of the world and increase cell size.
    Among thousants of cells, the overall image of the world will be the unaffected by 
    the random removal of most.
*/


const CELL_SIZE = 2 //px used only when rendering with rect()

// Make test worlds shaped like a ball
const WORLD_500_10 = makeWorld(500, 0.1)
const WORLD_5000_10 = makeWorld(5000, 0.1)



let DOM_SECTIONS_ELEMENTS = fetchDOMElements()


// Main Sequence
main()
async function main() {
    attachEventListeners()

    await setTimeoutPromise(100)
    console.log("Testing 2D canvas with rect() 5000 * 5000 10%..")
    testCanvas2DRect(WORLD_5000_10)

    await setTimeoutPromise(100)
    console.log("Testing 2D canvas with line() 5000 * 5000 10%..")
    testCanvas2DLine(WORLD_5000_10)

    await setTimeoutPromise(100)
    console.log("Testing 2D canvas with image WORLD with 5000 * 5000 10% world ...")
    testCanvasImagedata(WORLD_5000_10)

    await setTimeoutPromise(100)
    console.log("Testing WebGL canvas with pixiJS 500 * 500 10%..")
    testPixiJS(WORLD_500_10)
}

function attachEventListeners() {
    DOM_SECTIONS_ELEMENTS.SECTION2D_RECT.REFRESH_BTN.addEventListener('click', () => {
        testCanvas2DRect(WORLD_5000_10)
    })

    DOM_SECTIONS_ELEMENTS.SECTION2D_LINE.REFRESH_BTN.addEventListener('click', () => {
        testCanvas2DLine(WORLD_5000_10)
    })

    DOM_SECTIONS_ELEMENTS.SECTION_IMAGEDATA.REFRESH_BTN.addEventListener('click', () => {
        testCanvasImagedata(WORLD_5000_10)
    })
    DOM_SECTIONS_ELEMENTS.SECTIONWEBGL_PIXI.REFRESH_BTN.addEventListener('click', () => {
        testPixiJS(WORLD_500_10)
    })
}

function makeWorld(SIDE_SIZE: number, FILL_RATIO: number) {
    const WORLD = new Uint16Array(SIDE_SIZE * SIDE_SIZE * 2)
    const MAX_RADIUS = SIDE_SIZE / 2 * 0.8, OFFSET = SIDE_SIZE / 2
    const L = WORLD.length
    const PI = Math.PI

    for (let i = 0; i < L * FILL_RATIO; i += 2) {
        const ANGLE = Math.random() * 2 * PI, RADIUS = Math.random() * MAX_RADIUS
        WORLD[i] = Math.floor(Math.cos(ANGLE) * RADIUS + OFFSET) + 1
        WORLD[i + 1] = Math.floor(Math.sin(ANGLE) * RADIUS + OFFSET) + 1
    }

    return WORLD
}




function testCanvas2DRect(WORLD: Uint16Array) {
    const { CANVAS, DS_FACTOR_SELECT, CELLS_DREW_UI, EXEC_TIME_UI } = DOM_SECTIONS_ELEMENTS.SECTION2D_RECT


    const DS_FACTOR: number = Number.parseInt(DS_FACTOR_SELECT.value)
    const AXIS_DS_FACTOR = Math.sqrt(DS_FACTOR)

    CANVAS.width = CANVAS.height = Math.sqrt(WORLD.length / 2) / AXIS_DS_FACTOR
    CANVAS.style.transform = `scale(${500 / CANVAS.width})`

    const CTX2D = <CanvasRenderingContext2D>CANVAS.getContext('2d')
    const PIXEL_SIZE = CELL_SIZE * DS_FACTOR //px
    const COLOR = rgbToHex(
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255),
    )
    const TIMELINE = new Timeline('Render canvas with 2D rect')

    // Clear previous 
    CTX2D.fillStyle = '#000000'
    CTX2D.fillRect(0, 0, CANVAS.width, CANVAS.height)

    // Draw the WORLD
    CTX2D.beginPath()
    CTX2D.fillStyle = COLOR

    let PIXELS_DRAWN = 0
    for (let i = 0; i <= WORLD.length; i += 2 * DS_FACTOR) {
        if (WORLD[i] === 0 && WORLD[i + 1] === 0) break

        const X = Math.round(WORLD[i] / AXIS_DS_FACTOR)
        const Y = Math.round(WORLD[i + 1] / AXIS_DS_FACTOR)

        CTX2D.rect(X, Y, PIXEL_SIZE / AXIS_DS_FACTOR, PIXEL_SIZE / AXIS_DS_FACTOR)
        PIXELS_DRAWN++
    }
    CTX2D.fill('nonzero')
    TIMELINE.mark('Draw to 2D canvas with rect()')

    // Print results
    TIMELINE.end(true)
    CELLS_DREW_UI.textContent = `Drew ${PIXELS_DRAWN} cells`
    EXEC_TIME_UI.textContent = TIMELINE.RUN_DURATION + 'ms'
}

function testCanvas2DLine(WORLD: Uint16Array) {
    const { CANVAS, DS_FACTOR_SELECT, CELLS_DREW_UI, EXEC_TIME_UI } = DOM_SECTIONS_ELEMENTS.SECTION2D_LINE

    const CTX2D = <CanvasRenderingContext2D>CANVAS.getContext('2d')
    const COLOR = rgbToHex(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255))

    const DS_FACTOR: number = Number.parseInt(DS_FACTOR_SELECT.value)
    const AXIS_DS_FACTOR = Math.sqrt(DS_FACTOR)

    CANVAS.width = CANVAS.height = Math.sqrt(WORLD.length / 2) / AXIS_DS_FACTOR
    CANVAS.style.transform = `scale(${500 / CANVAS.width})`

    const TIMELINE = new Timeline('Render canvas with line')

    // Clear previous 
    CTX2D.fillStyle = '#000000'
    CTX2D.fillRect(0, 0, CANVAS.width, CANVAS.height)

    // Draw the WORLD
    CTX2D.beginPath()
    CTX2D.strokeStyle = COLOR

    let PIXELS_DRAWN = 0
    for (let i = 0; i <= WORLD.length; i += 2 * DS_FACTOR) {
        if (WORLD[i] === 0 && WORLD[i + 1] === 0) break

        const X = Math.round(WORLD[i] / DS_FACTOR)
        const Y = Math.round(WORLD[i + 1] / DS_FACTOR)

        CTX2D.moveTo(X, Y)
        CTX2D.lineTo(X + 1, Y + 1)
        PIXELS_DRAWN++
    }

    CTX2D.stroke()
    TIMELINE.mark('Draw to 2D canvas with line()')

    // Print results
    TIMELINE.end(true)
    CELLS_DREW_UI.textContent = `Drew ${PIXELS_DRAWN} cells`
    EXEC_TIME_UI.textContent = TIMELINE.RUN_DURATION + 'ms'
}

function testCanvasImagedata(WORLD: Uint16Array) {
    const { CANVAS, DS_FACTOR_SELECT, CELLS_DREW_UI, EXEC_TIME_UI } = DOM_SECTIONS_ELEMENTS.SECTION_IMAGEDATA

    const DS_FACTOR: number = Number.parseInt(DS_FACTOR_SELECT.value)
    const AXIS_DS_FACTOR = Math.sqrt(DS_FACTOR)

    CANVAS.width = CANVAS.height = Math.sqrt(WORLD.length / 2) / AXIS_DS_FACTOR
    CANVAS.style.transform = `scale(${500 / CANVAS.width})`

    const CTX2D = <CanvasRenderingContext2D>CANVAS.getContext('2d')

    // Clear previous 
    CTX2D.fillStyle = '#000000'
    CTX2D.fillRect(0, 0, CANVAS.width, CANVAS.height)

    const IMG_DATA = CTX2D.getImageData(0, 0, CANVAS.width, CANVAS.width)
    const IMG_DATA_DATA = IMG_DATA.data


    const TIMELINE = new Timeline('Render canvas with image data')

    const COLOR = randomRGB()
    let PIXELS_DRAWN = 0, L = WORLD.length, IMG_WIDTH = IMG_DATA.width
    // Write world to imagedata
    for (let i = 0; i < L; i += 2 * DS_FACTOR) {
        const X = WORLD[i], Y = WORLD[i + 1]
        if (X === 0 && Y === 0) break

        const PIXEL_INDEX = Math.floor(X / AXIS_DS_FACTOR) * 4
            + Math.floor(Y / AXIS_DS_FACTOR) * IMG_WIDTH * 4

        IMG_DATA_DATA[PIXEL_INDEX] = COLOR[0]
        IMG_DATA_DATA[PIXEL_INDEX + 1] = COLOR[1]
        IMG_DATA_DATA[PIXEL_INDEX + 2] = COLOR[2]
        IMG_DATA_DATA[PIXEL_INDEX + 3] = 255
        PIXELS_DRAWN++
    }

    TIMELINE.mark('Rewrite ImgData')

    // Put imagedata to canvas
    CTX2D.putImageData(IMG_DATA, 0, 0)
    TIMELINE.mark('Put ImgData')

    // Print results
    TIMELINE.end(true)
    CELLS_DREW_UI.textContent = `Drew ${PIXELS_DRAWN} cells`
    EXEC_TIME_UI.textContent = TIMELINE.RUN_DURATION.toString() + 'ms'
}

function testPixiJS(WORLD: Uint16Array) {
    const { CANVAS, DS_FACTOR_SELECT, CELLS_DREW_UI, EXEC_TIME_UI, SELF } = DOM_SECTIONS_ELEMENTS.SECTIONWEBGL_PIXI

    const TIMELINE = new Timeline('Rendering Pixi')

    const PIXIE_APP = new PIXI.Application({
        width: 500,
        height: 500,
        antialias: false
    });

    SELF.appendChild(PIXIE_APP.view)

    // Draw the WORLD
    let PIXELS_DRAWN = 0
    for (let i = 0; i <= WORLD.length; i += 2) {
        if (WORLD[i] === 0 && WORLD[i + 1] === 0) break
        let rectangle = new PIXI.Graphics();
        rectangle.beginFill(0x66CCFF);
        rectangle.drawRect(WORLD[i], WORLD[i + 1], 2, 2);
        rectangle.endFill();
        PIXIE_APP.stage.addChild(rectangle);
        PIXELS_DRAWN++
    }
    TIMELINE.mark('Draw to WebGL canvas with pixi')

    // Print results
    TIMELINE.end(true)
    CELLS_DREW_UI.textContent = `Drew ${PIXELS_DRAWN} cells`
    EXEC_TIME_UI.textContent = TIMELINE.RUN_DURATION + 'ms'
}

function fetchDOMElements(): IDomSections {
    let DOM_SECTIONS_NAMES = {
        SECTION2D_LINE: <HTMLElement>document.getElementById('section-2d-line'),
        SECTION2D_RECT: <HTMLElement>document.getElementById('section-2d-rect'),
        SECTION_IMAGEDATA: <HTMLElement>document.getElementById('section-image-data'),
        SECTIONWEBGL_PIXI: <HTMLElement>document.getElementById('section-webgl-pixie'),
    }

    let DOM_SECTIONS_ELEMENTS = {} as IDomSections

    for (let SECTION_NAME in DOM_SECTIONS_NAMES) {
        const SECTION_EL = DOM_SECTIONS_NAMES[SECTION_NAME]

        if (!SECTION_EL) throw new Error('Missing section: ' + SECTION_NAME)

        let ELEMENTS = {
            SELF: SECTION_EL,
            CANVAS: <HTMLCanvasElement>SECTION_EL.querySelector('canvas'),
            REFRESH_BTN: <HTMLButtonElement>SECTION_EL.querySelector('button'),
            DS_FACTOR_SELECT: <HTMLSelectElement>SECTION_EL.querySelector('select.ds-factor'),
            EXEC_TIME_UI: <HTMLElement>SECTION_EL.querySelector('code.exec-time'),
            CELLS_DREW_UI: <HTMLElement>SECTION_EL.querySelector('h3.cells-drew'),
        } as IDomSectionElements

        DOM_SECTIONS_ELEMENTS[SECTION_NAME] = ELEMENTS
    }

    return DOM_SECTIONS_ELEMENTS
}