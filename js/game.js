class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext('2d')

        this.canvas.width = 500
        this.canvas.height = 700

        this.drawInterval = undefined
        this.fps = 1000/60
    
        this.background = new Background(this.ctx)

        this.car = new Car(this.ctx, (this.canvas.width/2) - 25, this.canvas.height - 150)

        this.pipes = []
        this.drawCount = 0

        this.points = 0
    }

    start() {
        if (!this.drawInterval) { //  para que no haya bucles raros. Si el juego no esta arrancado. Compruebo que no hay draw interval
            this.drawInterval = setInterval(() => {
                this.clear()
                this.move()
                this.draw()
                this.checkCollitions()
                this.drawCount++

                if (this.drawCount % PIPE_FRAMES === 0) {
                    this.addPipes()
                    this.drawCount = 0 
                }
            }, this.fps)
        }
    }

    pause() {
        clearInterval(this.drawInterval)

        this.ctx.save()
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(100, 270, 300, 200)
    
        this.ctx.font = '26px Arial'
        this.ctx.fillStyle = 'red'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(
          'Game over!',
          this.canvas.width / 2,
          this.canvas.height / 2,
        )
        this.ctx.fillStyle = 'white'
        this.ctx.fillText(
            `Your final score: ${this.points}`,
            this.canvas.width / 2,
            this.canvas.height / 2 + 50,
          )
        this.ctx.restore()
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        
        this.pipes = this.pipes.filter(pipe => pipe.y <= this.canvas.height) // ojo! borrar obstaculos fuera de pantalla. si es por arriba o por la izquierda, tener en cuenta el tamaño del objeto para que desaparezca depués
    }

    draw() {
        this.background.draw()
        this.car.draw()
        this.pipes.forEach(pipe => pipe.draw()) 

        this.ctx.save()
        this.ctx.font = 'bold 10px Arial'
        this.ctx.fillText(`SCORE`, 2, 670)
        this.ctx.font = 'bold 18px Arial'
        this.ctx.fillStyle = 'red'
        this.ctx.fillText(`${this.points}`, 10, 690)
        this.ctx.restore()
    }

    move() {
        this.background.move()
        this.car.move()
        this.pipes.forEach(pipe => pipe.move())
    }

    onKeyEvent(event) {
        this.car.onKeyEvent(event)
    }

    addPipes() { 

        // random width
        let getRandomArbitrary = ((min, max) => {
            return Math.random() * (max - min) + min;
          })
        
        let pipeWidth = getRandomArbitrary(150, this.canvas.width - 150)

        // choose side or random middle
        const xRigth = 0
        let xLeft = this.canvas.width - pipeWidth
        let xRandom = getRandomArbitrary(150, this.canvas.width - 250)

        const arrX = [xRigth, xLeft, xRandom]
        let chooseX = arrX[Math.floor(Math.random() * arrX.length)]

        this.pipes.push(
            new Pipe(this.ctx, chooseX, -100, pipeWidth, 'brown')
            ) 
    }

    checkCollitions() {
        if (this.pipes.some(pipe => this.car.collidesWith(pipe))) {
            this.pause()
        }

        const score = this.pipes.filter(pipe => pipe.y === this.car.y + this.car.height + 1).forEach((pipe) => {
            this.points += 10
        })
    }

}