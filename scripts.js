document.addEventListener('DOMContentLoaded', () => {
    const gameSquares = document.querySelectorAll('.game_square');
    const gameScore = document.getElementById('score');
    const finalScore = document.getElementById('final_score');
    const gameOver = document.getElementById('game_over');
    const gameStatus = document.getElementById('game_status');
    const gameOverBtn = document.getElementById('restart_btn');

    let width = 15;
    let currentShipIndex = 202;
    let currentInvaderIndex = 0;
    let alienInvadersDestroyed = [];
    let score = 0;
    let direction = 1;
    let invaderId;

    // Define alien invaders
    const alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ]

    // Draw the alien invaders
    alienInvaders.forEach(invader => gameSquares[currentInvaderIndex + invader].classList.add('invader'));

    // Draw the Spaceship
    gameSquares[currentShipIndex].classList.add('space_ship');

    // Move the Spaceship
    function moveShip(e) {
        gameSquares[currentShipIndex].classList.remove('space_ship');
        switch(e.keyCode) {
            case 37:
                if (currentShipIndex % width !== 0) currentShipIndex -= 1;
                break;
            case 39:
                if (currentShipIndex % width < width - 1) currentShipIndex += 1;
                break;
        }
        gameSquares[currentShipIndex].classList.add('space_ship');
    }
    document.addEventListener('keydown', moveShip);

    // Moves the alien invaders
    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length -1] % width === width -1;
        console.log(alienInvaders.length)
        if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width;
        } else if (direction === width) {
            if (leftEdge) {
                direction = 1
            } else {
                direction = -1
            }
        }
        for (let i = 0; i <= alienInvaders.length - 1; i++)  {
            gameSquares[alienInvaders[i]].classList.remove('invader')
        }
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            alienInvaders[i] += direction
        }
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            if (!alienInvadersDestroyed.includes(i)) {
                gameSquares[alienInvaders[i]].classList.add('invader')
            }
        }

        // Check for Game Over
        if (gameSquares[currentShipIndex].classList.contains('invader', 'space_ship')) {
            gameOver.style.display = 'flex';
            finalScore.textContent = score;
            gameStatus.textContent = 'Game Over!'
            gameSquares[currentShipIndex].classList.add('boom');
            clearInterval(invaderId)
        }

        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            if (alienInvaders[i] > (gameSquares.length - (width - 1))) {
                gameOver.style.display = 'flex';
                gameStatus.textContent = 'Game Over!'
                finalScore.textContent = score;
                clearInterval(invaderId)
            }
        }

        // Check for Win
        if (alienInvadersDestroyed.length === alienInvaders.length) {
            gameOver.style.display = 'flex';
            gameStatus.textContent = 'You Win!'
            finalScore.textContent = score;
            clearInterval(invaderId)
        }
    }

    invaderId = setInterval(moveInvaders, 500);

    // Shoot at aliens
    function shoot(e) {
        let laserId;
        let currentLaserIndex = currentShipIndex;

        // Move the laser from the ship to the alien invader
        function  moveLaser() {
            gameSquares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;
            gameSquares[currentLaserIndex].classList.add('laser');
            if (gameSquares[currentLaserIndex].classList.contains('invader')) {
                gameSquares[currentLaserIndex].classList.remove('laser');
                gameSquares[currentLaserIndex].classList.remove('invader');
                gameSquares[currentLaserIndex].classList.add('boom');
                setTimeout(() => gameSquares[currentLaserIndex].classList.remove('boom'), 250);
                clearInterval(laserId);
                const alienDestroyed = alienInvaders.indexOf(currentLaserIndex);
                alienInvadersDestroyed.push(alienDestroyed);
                score++;
                gameScore.textContent = score;
            }

            if (currentLaserIndex < width) {
                clearInterval(laserId);
                setTimeout(() => gameSquares[currentLaserIndex].classList.remove('laser'), 100)
            }
        }

        switch(e.keyCode) {
            case 32:
                laserId = setInterval(moveLaser, 100);
                break;
        }
    }

    document.addEventListener('keyup', shoot);

    gameOverBtn.addEventListener('click', function() {
        window.location.reload();
    })
})
