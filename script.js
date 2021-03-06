let overlay = document.querySelector('.overlay');
let modal = document.querySelector('.modal');
let speed = 0;

modal.addEventListener('click', function (e) {
    if (e.target.classList.contains('easy')){
        speed = 100;
    } else if (e.target.classList.contains('normal')){
        speed = 600;
    } else if (e.target.classList.contains('hard')){
        speed = 300;
    }

    if (e.target.classList.contains('button')){
        modal.style.display = 'none';
        overlay.style.display = 'none';
        startGame();
    }
})

function startGame() {

    let tetris = document.createElement('div');
    tetris.classList.add('tetris')

    for (let i = 0; i < 180; i++) {
        let excel = document.createElement('div');
        excel.classList.add('excel');
        tetris.appendChild(excel);
    }

    let main = document.getElementsByClassName('main')[0];
    main.appendChild(tetris);

    let excel = document.getElementsByClassName('excel');
    let i = 0;

// 18 rows, 10 columns
    for (let y = 18; y > 0; y--) {
        for (let x = 1; x < 11; x++) {
            excel[i].setAttribute('posX', x);
            excel[i].setAttribute('posY', y);
            i++;
        }
    }

// initial coordinates of first (lower left) square of the figure
// next coordinates are counted in left to right, low to up direction
    let x = 5,
        y = 15;
    let mainArr = [
        //line
        [
            [0, 1],
            [0, 2],
            [0, 3],

            //90 deg rotation
            [
                [-1, 1],
                [0, 0],
                [1, -1],
                [2, -2]
            ],

            //180 deg rotation
            [
                [1, -1],
                [0, 0],
                [-1, 1],
                [-2, 2]
            ],

            //270 deg rotation
            [
                [-1, 1],
                [0, 0],
                [1, -1],
                [2, -2]
            ],

            //360 deg rotation
            [
                [1, -1],
                [0, 0],
                [-1, 1],
                [-2, 2]
            ]

        ],

        //square
        [
            [1, 0],
            [0, 1],
            [1, 1],

            //90 deg rotation
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ],

            //180 deg rotation
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ],

            //270 deg rotation
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ],

            //360 deg rotation
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ]

        ],

        //L-shape
        [
            [1, 0],
            [0, 1],
            [0, 2],

            //90 deg rotation
            [
                [0, 0],
                [-1, 1],
                [1, 0],
                [2, -1]
            ],

            //180 deg rotation
            [
                [1, -1],
                [1, -1],
                [-1, 0],
                [-1, 0]
            ],

            //270 deg rotation
            [
                [-1, 0],
                [0, -1],
                [2, -2],
                [1, -1]
            ],

            //360 deg rotation
            [
                [0, -1],
                [0, -1],
                [-2, 0],
                [-2, 0]
            ]
        ],

        //mirrored L-shape
        [
            [1, 0],
            [1, 1],
            [1, 2],

            //90 deg rotation
            [
                [0, 0],
                [0, 0],
                [1, -1],
                [-1, -1]
            ],

            //180 deg rotation
            [
                [0, -1],
                [-1, 0],
                [-2, 1],
                [1, 0]
            ],

            //270 deg rotation
            [
                [2, 0],
                [0, 0],
                [1, -1],
                [1, -1]
            ],

            //360 deg rotation
            [
                [-2, 0],
                [1, -1],
                [0, 0],
                [-1, 1]
            ]
        ],

        //Z-shape
        [
            [1, 0],
            [-1, 1],
            [0, 1],

            //90 deg rotation
            [
                [0, -1],
                [-1, 0],
                [2, -1],
                [1, 0]
            ],

            //180 deg rotation
            [
                [0, 0],
                [1, -1],
                [-2, 0],
                [-1, -1]
            ],

            //270 deg rotation
            [
                [0, -1],
                [-1, 0],
                [2, -1],
                [1, 0]
            ],

            //360 deg rotation
            [
                [0, 0],
                [1, -1],
                [-2, 0],
                [-1, -1]
            ]
        ],

        //mirrored Z-shape
        [
            [1, 0],
            [1, 1],
            [2, 1],

            //90 deg rotation
            [
                [2, -1],
                [0, 0],
                [1, -1],
                [-1, 0]
            ],

            //180 deg rotation
            [
                [-2, 0],
                [0, -1],
                [-1, 0],
                [1, -1]
            ],

            //270 deg rotation
            [
                [2, -1],
                [0, 0],
                [1, -1],
                [-1, 0]
            ],

            //360 deg rotation
            [
                [-2, 0],
                [0, -1],
                [-1, 0],
                [1, -1]
            ]
        ],

        //T-shape
        [
            [1, 0],
            [2, 0],
            [1, 1],

            //90 deg rotation
            [
                [1, -1],
                [0, 0],
                [0, 0],
                [0, 0]
            ],

            //180 deg rotation
            [
                [0, 0],
                [-1, 0],
                [-1, 0],
                [1, -1]
            ],

            //270 deg rotation
            [
                [1, -1],
                [1, -1],
                [1, -1],
                [0, 0]
            ],

            //360 deg rotation
            [
                [-2, 0],
                [0, -1],
                [0, -1],
                [-1, -1]
            ]
        ]
    ]

    let currentFigure = 0;
    let figureBody = 0;
    let rotate = 1;

    function create() {
        //choose random figure from array
        function getRandom() {
            return Math.round(Math.random() * (mainArr.length - 1))
        }

        rotate = 1;
        currentFigure = getRandom();

        //coordinates of each cell of a figure
        figureBody = [
            document.querySelector(`[posX = "${x}"][posY = "${y}"]`),
            document.querySelector(`[posX = "${x + mainArr[currentFigure][0][0]}"][posY = "${y + mainArr[currentFigure][0][1]}"]`),
            document.querySelector(`[posX = "${x + mainArr[currentFigure][1][0]}"][posY = "${y + mainArr[currentFigure][1][1]}"]`),
            document.querySelector(`[posX = "${x + mainArr[currentFigure][2][0]}"][posY = "${y + mainArr[currentFigure][2][1]}"]`),
        ]

        for (let i = 0; i < figureBody.length; i++) {
            figureBody[i].classList.add('figure');
        }
    }

    create();

//score
    let score = 0;
    let input = document.getElementsByTagName('input')[0];
    input.value = `Your score: ${score}`;

//main logic
    function move() {
        let moveFlag = true;
        let coordinates = [
            [figureBody[0].getAttribute('posX'), figureBody[0].getAttribute('posY')],
            [figureBody[1].getAttribute('posX'), figureBody[1].getAttribute('posY')],
            [figureBody[2].getAttribute('posX'), figureBody[2].getAttribute('posY')],
            [figureBody[3].getAttribute('posX'), figureBody[3].getAttribute('posY')]
        ];

        for (let i = 0; i < coordinates.length; i++) {
            //if last row or something below
            if (coordinates[i][1] == 1 || document.querySelector(`[posX = "${coordinates[i][0]}"][posY = "${coordinates[i][1] - 1}"]`).classList.contains('set')) {
                moveFlag = false;
                break;
            }
        }

        if (moveFlag) {
            //remove class to decolor cells
            for (let i = 0; i < figureBody.length; i++) {
                figureBody[i].classList.remove('figure');
            }

            figureBody = [
                document.querySelector(`[posX = "${coordinates[0][0]}"][posY = "${coordinates[0][1] - 1}"]`),
                document.querySelector(`[posX = "${coordinates[1][0]}"][posY = "${coordinates[1][1] - 1}"]`),
                document.querySelector(`[posX = "${coordinates[2][0]}"][posY = "${coordinates[2][1] - 1}"]`),
                document.querySelector(`[posX = "${coordinates[3][0]}"][posY = "${coordinates[3][1] - 1}"]`)
            ]

            //color cells of the figure again
            for (let i = 0; i < figureBody.length; i++) {
                figureBody[i].classList.add('figure');
            }
        } else {

            for (let i = 0; i < figureBody.length; i++) {
                figureBody[i].classList.remove('figure');
                figureBody[i].classList.add('set');
            }

            //check if the row below is filled
            for (let i = 1; i < 15; i++) {
                let count = 0;
                for (let j = 1; j < 11; j++) {
                    if (document.querySelector(`[posX="${j}"][posY="${i}"]`).classList.contains('set')) {
                        count++;
                        if (count == 10) {

                            score += 10;
                            input.value = `Your score: ${score}`;

                            for (let k = 1; k < 11; k++) {
                                document.querySelector(`[posX="${k}"][posY="${i}"]`).classList.remove('set');
                            }

                            let setElems = document.querySelectorAll('.set');
                            let newSet = [];
                            for (let s = 0; s < setElems.length; s++) {
                                let setCoordinates = [setElems[s].getAttribute('posX'), setElems[s].getAttribute('posY')];
                                // only rows that are upper than filled row should be moved down
                                if (setCoordinates[1] > i) {
                                    setElems[s].classList.remove('set');
                                    newSet.push(document.querySelector(`[posX="${setCoordinates[0]}"][posY="${setCoordinates[1] - 1}"]`));
                                }
                            }
                            //color new positions of rows
                            for (let a = 0; a < newSet.length; a++) {
                                newSet[a].classList.add('set');
                            }
                            i--;
                        }
                    }
                }
            }

            //finish
            for (let n = 1; n < 11; n++) {
                //if there is a figure outside the visible field
                if (document.querySelector(`[posX="${n}"][posY="15"]`).classList.contains('set')) {
                    clearInterval(interval);
                    alert(`The game is over. Your score is ${score}`);
                    break;
                }
            }

            create();
        }
    }

    let interval = setInterval(() => {
        move();
    }, speed)

    let flag = true;

    window.addEventListener('keydown', function (e) {
        let coordinate1 = [figureBody[0].getAttribute('posX'), figureBody[0].getAttribute('posY')];
        let coordinate2 = [figureBody[1].getAttribute('posX'), figureBody[1].getAttribute('posY')];
        let coordinate3 = [figureBody[2].getAttribute('posX'), figureBody[2].getAttribute('posY')];
        let coordinate4 = [figureBody[3].getAttribute('posX'), figureBody[3].getAttribute('posY')];

        function getNewState(a) {
            flag = true;

            //plus sign before coordinate is for interpreting as a number addition, not a string concatenation
            let figureNew = [
                document.querySelector(`[posX = "${+coordinate1[0] + a}"][posY = "${coordinate1[1]}"]`),
                document.querySelector(`[posX = "${+coordinate2[0] + a}"][posY = "${coordinate2[1]}"]`),
                document.querySelector(`[posX = "${+coordinate3[0] + a}"][posY = "${coordinate3[1]}"]`),
                document.querySelector(`[posX = "${+coordinate4[0] + a}"][posY = "${coordinate4[1]}"]`)
            ];

            //nothing happens on left or right key pressed if there is already a figure there or a border
            for (let i = 0; i < figureNew.length; i++) {
                if (!figureNew[i] || figureNew[i].classList.contains('set')) {
                    flag = false;
                }
            }

            if (flag) {
                //remove class to decolor cells
                for (let i = 0; i < figureBody.length; i++) {
                    figureBody[i].classList.remove('figure');
                }

                //move the coordinates of a figure
                figureBody = figureNew;

                //color cells of the figure again
                for (let i = 0; i < figureBody.length; i++) {
                    figureBody[i].classList.add('figure');
                }
            }
        }

        //left arrow
        if (e.keyCode == 37) {
            getNewState(-1);
        }
        //right arrow
        else if (e.keyCode == 39) {
            getNewState(1);
        }
        //down arrow
        else if (e.keyCode == 40) {
            //move faster
            move();
        }
        //up arrow
        else if (e.keyCode == 38) {

            flag = true;

            //plus sign before coordinate is for interpreting as a number addition, not a string concatenation
            let figureNew = [
                document.querySelector(`[posX = "${+coordinate1[0] + mainArr[currentFigure][rotate + 2][0][0]}"][posY = "${+coordinate1[1] + mainArr[currentFigure][rotate + 2][0][1]}"]`),
                document.querySelector(`[posX = "${+coordinate2[0] + mainArr[currentFigure][rotate + 2][1][0]}"][posY = "${+coordinate2[1] + mainArr[currentFigure][rotate + 2][1][1]}"]`),
                document.querySelector(`[posX = "${+coordinate3[0] + mainArr[currentFigure][rotate + 2][2][0]}"][posY = "${+coordinate3[1] + mainArr[currentFigure][rotate + 2][2][1]}"]`),
                document.querySelector(`[posX = "${+coordinate4[0] + mainArr[currentFigure][rotate + 2][3][0]}"][posY = "${+coordinate4[1] + mainArr[currentFigure][rotate + 2][3][1]}"]`)
            ];

            //nothing happens on left or right key pressed if there is already a figure there or a border
            for (let i = 0; i < figureNew.length; i++) {
                if (!figureNew[i] || figureNew[i].classList.contains('set')) {
                    flag = false;
                }
            }

            if (flag) {
                //remove class to decolor cells
                for (let i = 0; i < figureBody.length; i++) {
                    figureBody[i].classList.remove('figure');
                }

                //move the coordinates of a figure
                figureBody = figureNew;

                //color cells of the figure again
                for (let i = 0; i < figureBody.length; i++) {
                    figureBody[i].classList.add('figure');
                }
            }

            if (rotate < 4) {
                rotate++;
            } else {
                rotate = 1;
            }
        }
    })
}