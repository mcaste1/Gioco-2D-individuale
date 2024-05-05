class Pacman {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = 4;
        this.nextDirection = 4;
        this.frameCount = 7;
        this.currentFrame = 1;
        setInterval(() => {
            this.cambiaAnimazione();
        }, 100);
    }

    moveProcess() {
        this.cambiaDirezSePoss();
        this.avanti();
        if (this.checkCollisions()) {
            this.indietro();
            return;
        }
    }

    mangia() {
        for (let i = 0; i < mappa.length; i++) {
            for (let j = 0; j < mappa[0].length; j++) {
                if (mappa[i][j] == 2 && this.getMappaX() == j && this.getMappaY() == i) {
                    mappa[i][j] = 3;
                    score++;
                }
            }
        }
    }

    indietro() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // destra
                this.x -= this.speed;
                break;
            case DIRECTION_UP: // su
                this.y += this.speed;
                break;
            case DIRECTION_LEFT: // sinistra
                this.x += this.speed;
                break;
            case DIRECTION_BOTTOM: // giu
                this.y -= this.speed;
                break;
        }
    }

    avanti() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // destra
                this.x += this.speed;
                break;
            case DIRECTION_UP: // su
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT: // sinistra
                this.x -= this.speed;
                break;
            case DIRECTION_BOTTOM: // giu
                this.y += this.speed;
                break;
        }
    }

    checkCollisions() {
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

    controlloCollisioneFantasma(ghosts) {
        for (let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];
            if (
                ghost.getMappaX() == this.getMappaX() &&
                ghost.getMappaY() == this.getMappaY()
            ) {
                return true;
            }
        }
        return false;
    }

    cambiaDirezSePoss() {
        if (this.direction == this.nextDirection) return;
        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.avanti();
        if (this.checkCollisions()) {
            this.indietro();
            this.direction = tempDirection;
        } else {
            this.indietro();
        }
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

    cambiaAnimazione() {
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    draw() {
        canvasContext.save();
        canvasContext.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        );
        canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
        canvasContext.translate(
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2
        );
        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame - 1) * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            this.x,
            this.y,
            this.width,
            this.height
        );
        canvasContext.restore();
    }
}
