
console.log("STARTING INFINITE LOOP TEST")

let n_iterations_setTimeout = 0, n_iterations_setInterval = 0
let infinite_timeout
let infinite_interval
let setTimeout_paused = true, setInterval_paused = true
let last_call_date = window.performance.now()
let is_busy = false


const DOM_SECTIONS = {
    SETTIMEOUT_SEQUENCE: document.getElementById('section-setTimeout-sequence'),
    SETINTERVAL_1: document.getElementById('section-setInterval-1'),
}

const DOM_ELEMENTS = {
    SETTIMEOUT_SEQUENCE: {
        BTN_START: DOM_SECTIONS.SETTIMEOUT_SEQUENCE.getElementsByClassName('start')[0],
        BTN_STOP: DOM_SECTIONS.SETTIMEOUT_SEQUENCE.getElementsByClassName('stop')[0],
        ITERATIONS_COUNT_UI: DOM_SECTIONS.SETTIMEOUT_SEQUENCE.getElementsByClassName('iterations-count')[0],
        HEAP_SIZE_UI: DOM_SECTIONS.SETTIMEOUT_SEQUENCE.getElementsByClassName('heap-size')[0]
    },
    SETINTERVAL_1: {
        BTN_START: DOM_SECTIONS.SETINTERVAL_1.getElementsByClassName('start')[0],
        BTN_STOP: DOM_SECTIONS.SETINTERVAL_1.getElementsByClassName('stop')[0],
        ITERATIONS_COUNT_UI: DOM_SECTIONS.SETINTERVAL_1.getElementsByClassName('iterations-count')[0],
        HEAP_SIZE_UI: DOM_SECTIONS.SETINTERVAL_1.getElementsByClassName('heap-size')[0]
    }

}


/** Mock function that takes 5ms to resolve */
function render() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 5)
    })
}

/** When render returns start a new setTimeout */
async function loopSetTimeoutSequence() {
    await render()
    n_iterations_setTimeout++
    showNIterations(DOM_ELEMENTS.SETTIMEOUT_SEQUENCE.ITERATIONS_COUNT_UI, n_iterations_setTimeout)
    showHeapSize(DOM_ELEMENTS.SETTIMEOUT_SEQUENCE.HEAP_SIZE_UI)
    if (!setTimeout_paused) {
        infinite_timeout = setTimeout(loopSetTimeoutSequence, 20)
    } else {
        clearTimeout(infinite_timeout)
        infinite_timeout = null
    }
}

/** Evaluates the time difference between now and the last time the render function was called
 * if it's > 20ms, call it again
  */
function loopSetInterval() {
    if (infinite_interval) return
    infinite_interval = setInterval(async () => {
        if (!setInterval_paused && !is_busy && window.performance.now() - last_call_date > 20) {
            is_busy = true
            await render()
            is_busy = false
            n_iterations_setInterval++
            showNIterations(DOM_ELEMENTS.SETINTERVAL_1.ITERATIONS_COUNT_UI, n_iterations_setInterval)
            showHeapSize(DOM_ELEMENTS.SETINTERVAL_1.HEAP_SIZE_UI)
            last_call_date = window.performance.now()
        }

    }, 1)
}



function showHeapSize(ui_el) {
    ui_el.innerHTML = n_iterations_setTimeout
    if (window.performance.memory) {
        ui_el.innerHTML = window.performance.memory.totalJSHeapSize
    } else {
        ui_el.innerHTML = 'Your browser does not have a memory API. Use google chrome'
    }
}

function showNIterations(ui_el, n_iterations) {
    ui_el.innerHTML = n_iterations
}

DOM_ELEMENTS.SETTIMEOUT_SEQUENCE.BTN_START.addEventListener('click', () => {
    setTimeout_paused = false
    loopSetTimeoutSequence()
})

DOM_ELEMENTS.SETTIMEOUT_SEQUENCE.BTN_STOP.addEventListener('click', () => {
    setTimeout_paused = true
    clearTimeout(infinite_timeout)
})


DOM_ELEMENTS.SETINTERVAL_1.BTN_START.addEventListener('click', () => {
    setInterval_paused = false
    loopSetInterval()
})

DOM_ELEMENTS.SETINTERVAL_1.BTN_STOP.addEventListener('click', () => {
    setInterval_paused = true
})

