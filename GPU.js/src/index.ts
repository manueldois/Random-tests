import './styles.scss'
import GPU, { input } from './gpu.js/gpu-browser.js';
import { Timeline } from './util';
import { deepEqual } from 'assert';

console.log('STARTING GPUJS TEST')
const gpu = new GPU();
const N_CELLS = 30000

console.log("WebGL supported: ", GPU.isWebGLSupported)



main()
async function main() {
    const WORLD = initializeRandomWorld()
    console.log(`World is a Uint16Array with ${N_CELLS} living cells. Cell position is encoded as an (X,Y) tuple`)
    console.log('The goal of the test is to count the number of neighbors for each cell in the World, on CPU and GPU')
    console.log("World: ", WORLD)

    const TIMELINE = new Timeline('Count Neighbors')


    console.log("Starting computation on CPU")
    const N_NEIGHBORS_CPU = countNeighborsAliveCellsCPU(WORLD)
    TIMELINE.mark('Count all neighborgs with CPU')
    console.log("Finished computation on CPU")
    
    
    console.log("Starting computation on GPU")
    const countNeighborsKernel = createGPUKernelToCountNeighbors()
    const N_NEIGHBORS_GPU = new Uint16Array(countNeighborsKernel(
        WORLD, WORLD
    ))    
    TIMELINE.mark('Count all neighborgs with GPU')
    console.log("Finished computation on GPU")

    TIMELINE.end()


    deepEqual(N_NEIGHBORS_CPU, N_NEIGHBORS_GPU, 'Outputs are different, failed')
    console.log("Outputs are equal")
    console.log("Computation executation times: ", TIMELINE.TIMES)
}

function createGPUKernelToCountNeighbors() {
    return gpu.createKernel(function (WORLD: Uint16Array, CELLS_TO_SRC: Uint16Array) {
        // Split GPU threads to each look for the neighbors of one cell 

        let X = 0, Y = 0
        let CELL_X = CELLS_TO_SRC[this.thread.x * 2], CELL_Y = CELLS_TO_SRC[this.thread.x * 2 + 1]
        let SUM = 0
        for (let i = 0; i < this.constants.N_CELLS; i++) {
            X = WORLD[i * 2]
            Y = WORLD[i * 2 + 1]

            if (X === CELL_X - 1) {
                if (Y === CELL_Y - 1 || Y === CELL_Y || Y === CELL_Y + 1) {
                    SUM++
                }
            }

            if (X === CELL_X) {
                if (Y === CELL_Y - 1 || Y === CELL_Y + 1) {
                    SUM++
                }
            }

            if (X === CELL_X + 1) {
                if (Y === CELL_Y - 1 || Y === CELL_Y || Y === CELL_Y + 1) {
                    SUM++
                }
            }

        }

        return SUM
    }, { constants: { N_CELLS: N_CELLS } }).setOutput([N_CELLS])
}

function countNeighborsAliveCellsCPU(WORLD: Uint16Array) {
    let N_NEIGHBORS = new Uint16Array(WORLD.length / 2)

    for (let j = 0; j < WORLD.length; j += 2) {
        // For each cell in the world, search the whole world for neighbors
        let X = 0, Y = 0
        let CELL_X = WORLD[j], CELL_Y = WORLD[j+1]
        let SUM = 0

        for (let i = 0; i < WORLD.length; i += 2) {
            X = WORLD[i]
            Y = WORLD[i + 1]

            if (X === CELL_X - 1) {
                if (Y === CELL_Y - 1 || Y === CELL_Y || Y === CELL_Y + 1) {
                    SUM++
                }
                continue
            }

            if (X === CELL_X) {
                if (Y === CELL_Y - 1 || Y === CELL_Y + 1) {
                    SUM++
                }
                continue
            }

            if (X === CELL_X + 1) {
                if (Y === CELL_Y - 1 || Y === CELL_Y || Y === CELL_Y + 1) {
                    SUM++
                }
                continue
            }
        }

        N_NEIGHBORS[j / 2] = SUM
    }

    return N_NEIGHBORS
}

function initializeRandomWorld() {
    const WORLD_UINT = new Uint16Array(N_CELLS * 2)
    const AXIS_LENGHT = Math.sqrt(N_CELLS)
    for (let i = 0; i < WORLD_UINT.length; i += 2) {
        WORLD_UINT[i] = Math.random() * AXIS_LENGHT
        WORLD_UINT[i + 1] = Math.random() * AXIS_LENGHT
    }

    return WORLD_UINT
}