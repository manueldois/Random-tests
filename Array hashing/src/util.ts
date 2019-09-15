


class Timeline {
    TIMES = new Map()
    START_TIME = window.performance.now()
    PREVIOUS_TIME = window.performance.now()
    END_TIME: number | undefined
    RUN_DURATION: number = 0
    LOG_TO_CONSOLE_THRESHOLD: number

    constructor(public NAME: string) {

    }

    mark(LABEL: string) {
        this.TIMES.set(LABEL, Math.round((window.performance.now() - this.PREVIOUS_TIME) * 100) / 100)
        this.RUN_DURATION += window.performance.now() - this.PREVIOUS_TIME
        this.PREVIOUS_TIME = window.performance.now()
    }

    get(LABEL: string) {
        const TIME = this.TIMES.get(LABEL)
        return TIME !== null ? TIME : 'null'
    }

    setLogThereshold(LIMIT: number) {
        this.LOG_TO_CONSOLE_THRESHOLD = LIMIT
    }

    end(PRINT = false) {
        this.END_TIME = window.performance.now()
        this.RUN_DURATION = this.END_TIME - this.START_TIME
        this.TIMES.set('TOTAL',Math.round(this.RUN_DURATION * 100) / 100)

        if (PRINT) {
            console.log(this.NAME,this.TIMES)
        } else {
            if (this.LOG_TO_CONSOLE_THRESHOLD && this.RUN_DURATION > this.LOG_TO_CONSOLE_THRESHOLD) {
                console.log(this.NAME,this.TIMES)
            }
        }
    }
}





export { Timeline}