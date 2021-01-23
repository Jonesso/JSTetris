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
let x = 5, y = 15;
let mainArr = [
    //line
    [
        [0, 1],
        [0, 2],
        [0, 3]
    ],

    //square
    [
        [1, 0],
        [0, 1],
        [1, 1]
    ],

    //L-shape
    [
        [1, 0],
        [0, 1],
        [0, 2]
    ],

    //mirrored L-shape
    [
        [1, 0],
        [1, 1],
        [1, 2]
    ],

    //Z-shape
    [
        [1, 0],
        [-1, 1],
        [0, 1]
    ],

    //mirrored Z-shape
    [
        [1, 0],
        [1, 1],
        [2, 1]
    ],

    //T-shape
    [
        [0, 1],
        [1, 1],
        [-1, 1]
    ],

    //T-shape (upside down)
    [
        [1, 0],
        [2, 0],
        [1, 1]
    ]
]

let currentFigure = 0;
let figureBody = 0;

function create() {
    //choose random figure from array
    function getRandom() {
        return Math.round(Math.random() * (mainArr.length - 1))
    }

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
        create();
    }
}

let interval = setInterval(() => {
    move();
}, 300)