class Cluster {
    DATA: Uint16Array
    CHILDREN: Cluster[]

    constructor(
        public N_POINTS: number,
        public MIN_X: number,
        public MAX_X: number,
        public MIN_Y: number,
        public MAX_Y: number,
    ) {
        this.DATA = new Uint16Array(2 * N_POINTS)
    }

    add(CELL: number[]) {
        if (!this.CHILDREN) {
            // Add to own DATA
            let i = 0;
            for (i = 0; i < this.DATA.length; i += 2) {
                if (!this.DATA[i] && !this.DATA[i + 1]) {
                    this.DATA[i] = CELL[0]
                    this.DATA[i + 1] = CELL[1]
                    break
                }
            }

            console.log('\n')
            console.log("I recieved a cell, my bounding box is: X " + this.MIN_X + ' to ' + this.MAX_X + ', Y ' + this.MIN_Y + ' to ' + this.MAX_Y )
            console.log("Added to own data: ", this.DATA)

            if (i >= this.DATA.length - 2) this.splitIntoFour()
        }

        if (this.CHILDREN) {
            // Find where the new cell fits
            const CHILD = this.findChildWithCell(CELL)
            // Redirect cell
            CHILD.add(CELL)
        }
    }

    has(CELL: number[]): boolean {
        if (!this.CHILDREN) {
            for (let i = 0; i < this.DATA.length; i += 2) {
                if (!this.DATA[i] && !this.DATA[i + 1]) break
                if (CELL[0] === this.DATA[i] && CELL[1] === this.DATA[i + 1]) return true
            }
            return false
        }

        if (this.CHILDREN) {
            // Find where the new cell should be
            const CHILD = this.findChildWithCell(CELL)
            // Redirect cell
            return CHILD.has(CELL)
        }
    }

    passDataIntoChildren() {
        let i = 0;
        for (i = 0; i < this.DATA.length; i += 2) {
            if (!this.DATA[i] && !this.DATA[i + 1]) break
            this.add([this.DATA[i], this.DATA[i + 1]])
        }
        delete this.DATA
    }

    findChildWithCell(CELL: number[]) {
        if (!this.CHILDREN) throw new Error('No children to fit cell into')

        const CELL_X = CELL[0], CELL_Y = CELL[1]
        for (let CHILD of this.CHILDREN) {
            if (
                CELL_X >= CHILD.MIN_X && CELL_X <= CHILD.MAX_X &&
                CELL_Y >= CHILD.MIN_Y && CELL_Y <= CHILD.MAX_Y
            ) {
                return CHILD
            }
        }
        // console.log(this.CHILDREN)
        throw new Error(`Did not find any children that could fit cell (${CELL_X}, ${CELL_Y}): `)
    }

    splitIntoFour() {
        const { N_POINTS, MIN_X, MIN_Y, MAX_X, MAX_Y } = this
        const [COG_X, COG_Y] = this.getCOG()
        console.log("Cluster full..")
        console.log("Spliting by center of gravity of own cells: X: ", COG_X, ", Y: ", COG_Y)
        this.CHILDREN = [
            new Cluster(N_POINTS, MIN_X, COG_X, MIN_Y, COG_Y), // TOP LEFT
            new Cluster(N_POINTS, COG_X, MAX_X, MIN_Y, COG_Y), // TOP RIGHT
            new Cluster(N_POINTS, MIN_X, COG_X, COG_Y, MAX_Y), // BOTTOM LEFT
            new Cluster(N_POINTS, COG_X, MAX_X, COG_Y, MAX_Y) // BOTTOM RIGHT
        ]
        console.log("Created children: ",this.CHILDREN)
        this.passDataIntoChildren()
    }

    getCOG() {
        let CUMSUM_X = 0, CUMSUM_Y = 0, i = 0
        for (i = 0; i < this.DATA.length; i += 2) {
            if (!this.DATA[i] && !this.DATA[i + 1]) break
            CUMSUM_X += this.DATA[i]
            CUMSUM_Y += this.DATA[i + 1]
        }

        return [Math.floor(CUMSUM_X / (i / 2)), Math.floor(CUMSUM_Y / (i / 2))]
    }
}

export default Cluster