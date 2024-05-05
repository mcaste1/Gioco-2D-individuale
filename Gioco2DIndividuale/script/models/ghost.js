class Ghost {
    constructor(x, y, width, height, speed, imageX, imageY, imageWidth, imageHeight, range) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.range = range;
        this.randomTargetIndex = parseInt(Math.random() * 4);
        this.target = randomTargetsForGhosts[this.randomTargetIndex];
        setInterval(() => {
            this.cambiaDirezioneRand();
        }, 10000);
    }

    isInRange() {
        let xDistance = Math.abs(pacman.getMappaX() - this.getMappaX());
        let yDistance = Math.abs(pacman.getMappaY() - this.getMappaY());
        if (Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range) {
            return true;
        }
        return false;
    }

    cambiaDirezioneRand() {
        let addition = 1;
        this.randomTargetIndex += addition;
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }

    moveProcess() {
        if (this.isInRange()) {
            this.target = pacman;
        } else {
            this.target = randomTargetsForGhosts[this.randomTargetIndex];
        }
        this.cambiaDirezSePoss();
        this.avanti();
        if (this.controlloCollisioni()) {
            this.indietro();
            return;
        }
    }

    indietro() {
        switch (this.direction) {
            case 4: // destra
                this.x -= this.speed;
                break;
            case 3: // su
                this.y += this.speed;
                break;
            case 2: // sinistra
                this.x += this.speed;
                break;
            case 1: // giu
                this.y -= this.speed;
                break;
        }
    }

    avanti() {
        switch (this.direction) {
            case 4: // destra
                this.x += this.speed;
                break;
            case 3: // su
                this.y -= this.speed;
                break;
            case 2: // sinistra
                this.x -= this.speed;
                break;
            case 1: // giu
                this.y += this.speed;
                break;
        }
    }

    controlloCollisioni() {
        let isCollided = false;
        if (
            mappa[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            mappa[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            mappa[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1 ||
            mappa[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1
        ) {
            isCollided = true;
        }
        return isCollided;
    }

    cambiaDirezSePoss() {
        let tempDirection = this.direction;
        this.direction = this.calcolaNuovaDirez(mappa, parseInt(this.target.x / oneBlockSize), parseInt(this.target.y / oneBlockSize));
        if (typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }
        if (this.getMappaY() != this.getMappaYRightSide() && (this.direction == DIRECTION_LEFT || this.direction == DIRECTION_RIGHT)) {
            this.direction = DIRECTION_UP;
        }
        if (this.getMappaX() != this.getMappaXRightSide() && this.direction == DIRECTION_UP) {
            this.direction = DIRECTION_LEFT;
        }
        this.avanti();
        if (this.controlloCollisioni()) {
            this.indietro();
            this.direction = tempDirection;
        } else {
            this.indietro();
        }
        console.log(this.direction);
    }

    calcolaNuovaDirez(mappa, destX, destY) {
        let mp = [];
        for (let i = 0; i < mappa.length; i++) {
            mp[i] = mappa[i].slice();
        }

        let queue = [
            {
                x: this.getMappaX(),
                y: this.getMappaY(),
                rightX: this.getMappaXRightSide(),
                rightY: this.getMappaYRightSide(),
                moves: [],
            },
        ];
        while (queue.length > 0) {
            let poped = queue.shift();
            if (poped.x == destX && poped.y == destY) {
                return poped.moves[0];
            } else {
                mp[poped.y][poped.x] = 1;
                let neighborList = this.addNeighbors(poped, mp);
                for (let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }

        return 1;
    }

    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if (
            poped.x - 1 >= 0 &&
            poped.x - 1 < numOfRows &&
            mp[poped.y][poped.x - 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.x + 1 >= 0 &&
            poped.x + 1 < numOfRows &&
            mp[poped.y][poped.x + 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.y - 1 >= 0 &&
            poped.y - 1 < numOfColumns &&
            mp[poped.y - 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
        }
        if (
            poped.y + 1 >= 0 &&
            poped.y + 1 < numOfColumns &&
            mp[poped.y + 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_BOTTOM);
            queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
        }
        return queue;
    }

    getMappaX() {
        let mappaX = parseInt(this.x / oneBlockSize);
        return mappaX;
    }

    getMappaY() {
        let mappaY = parseInt(this.y / oneBlockSize);
        return mappaY;
    }

    getMappaXRightSide() {
        let mappaX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mappaX;
    }

    getMappaYRightSide() {
        let mappaY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mappaY;
    }

    changeAnimation() {
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    draw() {
        canvasContext.save();
        canvasContext.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
        canvasContext.restore();
        canvasContext.beginPath();
        canvasContext.strokeStyle = "red";
        canvasContext.arc(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2,
            this.range * oneBlockSize,
            0,
            2 * Math.PI
        );
        canvasContext.stroke();
    }
}

let updateGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }
};

let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
};
