import './styles.scss'
import { Timeline } from './util'
import Cluster from './cluster'

console.log('STARTING WORLD BUCKETING TEST')


let WORLD = new Cluster(6, 0, Infinity, 0, Infinity)

main()
async function main() {
    attachEventListeners()
    console.log("GLOBAL cluster: ",WORLD)

    // @ts-ignore
    window.world = WORLD
}

function attachEventListeners() {
    const BTN_ADDCELL_TL = <HTMLElement>document.getElementById('btn-addcell-tl')
    const BTN_ADDCELL_TR = <HTMLElement>document.getElementById('btn-addcell-tr')
    const BTN_ADDCELL_BL = <HTMLElement>document.getElementById('btn-addcell-bl')
    const BTN_ADDCELL_BR = <HTMLElement>document.getElementById('btn-addcell-br')

    BTN_ADDCELL_TL.addEventListener('click', () => addCellNear('tl'))
    BTN_ADDCELL_TR.addEventListener('click', () => addCellNear('tr'))
    BTN_ADDCELL_BL.addEventListener('click', () => addCellNear('bl'))
    BTN_ADDCELL_BR.addEventListener('click', () => addCellNear('br'))

}

function addManyAtRandom(N: number) {
    const POSITIONS = ['tl', 'tr', 'bl', 'br']
    const TIMELINE = new Timeline('Get Set Cells')
    for (let i = 0; i < N; i++) {
        const POSITION = POSITIONS[randomInt(0, 3)]
        addCellNear(POSITION)
    }
    TIMELINE.mark(`Add ${N} cells at random`)
    TIMELINE.end()
    console.log(TIMELINE.TIMES)
}

function addCellNear(POSITION: string) {
    const MIN_X = 0, MIN_Y = 0, MAX_X = 1000, MAX_Y = 1000
    const MID_X = (MAX_X - MIN_X) / 2, MID_Y = (MAX_Y - MIN_Y) / 2
    let NEW_CELL = []
    switch (POSITION) {
        case 'tl':
            NEW_CELL = [randomInt(MIN_X, MID_X), randomInt(MIN_Y, MID_Y)]
            break;

        case 'tr':
            NEW_CELL = [randomInt(MID_X, MAX_X), randomInt(MIN_Y, MID_Y)]
            break;

        case 'bl':
            NEW_CELL = [randomInt(MIN_X, MID_X), randomInt(MID_Y, MAX_Y)]
            break;

        case 'br':
            NEW_CELL = [randomInt(MID_X, MAX_X), randomInt(MID_Y, MAX_X)]
            break;
        default:
            break;
    }

    console.log("New cell: ", NEW_CELL);
    (<HTMLElement> document.getElementById('cell-added-ui')).textContent = JSON.stringify(NEW_CELL)
    WORLD.add(NEW_CELL)
}

function randomInt(MIN, MAX) {
    return Math.round(Math.random() * (MAX - MIN) + MIN)
}