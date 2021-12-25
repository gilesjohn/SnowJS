(() => {
    // Todo: use linked list for snowFlakes, unlink current in iteration if it gets too low

    const snowFlakes = []
    const flakeImage = document.createElement("img")
    flakeImage.src = "snowflake.png"
    
    const canvas = document.createElement("canvas")
    canvas.style.position = "fixed"
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    //canvas.style.background = "rgba(0,0,0,0.1)"
    canvas.style.pointerEvents = "none"
    document.body.append(canvas)

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const context = canvas.getContext('2d')

    class SnowFlake {
        constructor(x, y, v) {
            this.x = x
            this.y = y
            this.v = v
        }
    }

    const targetFramerate = 60
    const targetFrametime = 1/targetFramerate
    let lastFrame
    let thisFrame

    const targetFlakeCount = 200
    const maxFlakesPerFrame = 2

    function update() {
        thisFrame = performance.now()
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        const frameTime = Math.max(targetFrametime, (lastFrame == null) ? targetFrametime : (thisFrame - lastFrame) / 1000)
        let count = 0;
        const toRemove = []
        for (const flake of snowFlakes) {
            context.drawImage(flakeImage, flake.x, flake.y, 10, 10)
            moveFlake(flake, frameTime)
            if (flake.y > context.canvas.height) {
                toRemove.push(count)
            }
            ++count;
        }
        toRemove.sort((a,b) => a - b)
        toRemove.reverse() // make sure indices are in reverse order otherwise removing the earlier ones will affect the latter
        for (const rmvInd of toRemove) {
            snowFlakes.splice(rmvInd, 1)
        }
        spawnFlakes()
        lastFrame = thisFrame
    }
    function moveFlake(flake, dt) {
        flake.x += (flake.v[0] * dt)
        flake.y += (flake.v[1] * dt)
    }
    function spawnFlakes() {
        if (snowFlakes.length < targetFlakeCount) {
            const toSpawn = Math.floor(Math.random() * maxFlakesPerFrame)
            for (let i = 0; i < toSpawn; ++i) {
                const x = Math.floor(Math.random() * context.canvas.width)
                const vx = Math.floor(Math.random() * 10) -5
                const vy = Math.floor(Math.random() * 90) + 20
                snowFlakes.push(new SnowFlake(x,0,[vx,vy]))
            }
        }
    }

    setInterval(update, targetFrametime * 1000)
})()