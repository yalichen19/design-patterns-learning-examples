// 棋盘的宽度和高度
const X_LEN = 30;
const Y_LEN = 30;

// 小格子的宽度
const SQUARE_WIDTH = 20;

// 棋盘坐标
const BASE_X = 100;
const BASE_Y = 100;
// 蛇的速度
const SPEED = 500;

function Square(x1, y1) {
    this.x = x1;
    this.y = y1;
    this.view = null;
    this.width = SQUARE_WIDTH;
    this.height = SQUARE_WIDTH;
}

var Floor = utils.extends(Square);
var Food = utils.extends(Square);
var Stone = utils.extends(Square);
var Wall = utils.extends(Stone);
var SnakeBody = utils.extends(Square);
var SnakeHead = utils.extends(Square);

var Snake = utils.Singleton();
var Ground = utils.Singleton();
var Game = utils.Singleton();


const TouchEvent = {
    MOVE: 'Move',
    EAT: 'Eat',
    DEAD: 'Dead'
}

var game = new Game();
game.scroe = 0;
game.timer = null;
game.ground = null;
game.snake = null;
game.food = null;
game.init = function () {
    // 初始广场
    console.log('initGame')
    var gameGround = new Ground();
    gameGround.init();
    this.ground = gameGround;

    // 初始化蛇
    var gameSnake = new Snake();
    gameSnake.init(gameGround);
    this.snake = gameSnake;
};
game.run = function () {
    this.timer = setInterval(function () {
        var result = game.snake.move(game);  
    }, SPEED);
    document.onkeydown = function (e) {
        var keyNum = window.event ? e.keyCode : e.which;
        if (keyNum === 37 && game.snake.direction !== DirectionEnum.RIGHT) {
            game.snake.direction = DirectionEnum.LEFT;
        } else if (keyNum === 38 && game.snake.direction !== DirectionEnum.DOWN) {
            game.snake.direction = DirectionEnum.UP;
        } else if (keyNum === 39 && game.snake.direction !== DirectionEnum.LEFT) {
            game.snake.direction = DirectionEnum.RIGHT;
        } else if (keyNum === 40 && game.snake.direction !== DirectionEnum.UP) {
            game.snake.direction = DirectionEnum.DOWN;
        }
    }
    var result = game.snake.move(game); 

};
game.over = function () {
    alert('游戏结束，得分为：' + this.scroe);
}

var ground = new Ground ();
ground.squareTable = new Array(Y_LEN);
ground.xLen = X_LEN;
ground.yLen = Y_LEN;

ground.basePointX = BASE_X;
ground.basePointY = BASE_Y;

ground.view = null;
ground.init = function () {
    var viewGround = document.createElement('div');
    this.view = viewGround;
    viewGround.style.position = 'relative';
    viewGround.style.width = this.xLen * SQUARE_WIDTH + 'px';
    viewGround.style.height = this.yLen * SQUARE_WIDTH + 'px';
    viewGround.style.display = 'block';
    viewGround.style.left = this.basePointX + 'px';
    viewGround.style.top = this.basePointY + 'px';

    viewGround.style.background = 'white';
    document.body.appendChild(viewGround);

    for(var i = 0; i < this.yLen; i ++) {
        this.squareTable[i] = new Array(this.xLen);
        for (var j = 0; j < this.xLen; j ++) {
            var square;
            if (i === 0 || j === 0 || i === this.yLen - 1 || j === this.xLen - 1) {
                square = SquareFactory.create('Wall', j, i);
            } else {
                square = SquareFactory.create('Floor', j, i);
            }
            this.squareTable[i][j] = square;
            viewGround.appendChild(square.view);
        }
    }
}
ground.remove = function (x, y) {
    this.view.removeChild(this.squareTable[y][x].view);
    this.squareTable[y][x] = null;
}

ground.append = function (x, y, square) {
    this.squareTable[y][x] = square;
    this.view.appendChild(this.squareTable[y][x].view);
}

function SquareFactory(){};
SquareFactory.create = function (type, x, y) {
    if (typeof SquareFactory[type] !== 'function') {
        throw 'error';
    }
    var result = SquareFactory[type](x, y);
    return result;
}

SquareFactory.commonInit = function (obj, x1, y1, color, touchEvent) {
    obj.x = x1;
    obj.y = y1;
    obj.view = document.createElement('div');
    obj.view.style.position = 'absolute'
    obj.view.style.display = 'inline-block';
    obj.view.style.left = x1 * SQUARE_WIDTH + 'px';
    obj.view.style.top = y1 * SQUARE_WIDTH + 'px';
    obj.view.style.width = SQUARE_WIDTH + 'px';
    obj.view.style.height = SQUARE_WIDTH + 'px';
    obj.view.style.backgroundColor = color;
    obj.touch = function () {
        return touchEvent;
    }

}
// 需要这个工厂来创建floor food wall snake snakeHead snakeBody
SquareFactory.Floor = function (x1, y1) {
    var floor = new Floor();
    this.commonInit(floor, x1, y1, "orange", TouchEvent.MOVE);
    return floor;
}

SquareFactory.Food = function (x1, y1) {
    var food = new Food();
    this.commonInit(food, x1, y1, "green", TouchEvent.EAT);
    return food;
}

SquareFactory.Wall = function (x1, y1) {
    var wall = new Wall();
    this.commonInit(wall, x1, y1, "black", TouchEvent.DEAD);
    return wall;
}
SquareFactory.SnakeHead = function (x1, y1) {
    var snakeHead = new SnakeHead();
    this.commonInit(snakeHead, x1, y1, "red", TouchEvent.DEAD);
    return snakeHead;
}
SquareFactory.SnakeBody = function (x1, y1) {
    var snakeBody = new SnakeBody();
    this.commonInit(snakeBody, x1, y1, "blue", TouchEvent.MOVE);
    return snakeBody;
}


var snake = new Snake();
snake.head = null;
snake.tail = null;
snake.direction = 0;

var DirectionEnum = {
    UP: {x: 0, y: -1},
    DOWN: {x: 0, y: 1},
    LEFT: {x: -1, y: 0},
    RIGHT: {x: 1, y: 0}
}
snake.init = function(gameGround) {
    var tempHead = SquareFactory.create('SnakeHead', 3, 1);
    var tempBody1 = SquareFactory.create('SnakeBody', 2, 1);
    var tempBody2 = SquareFactory.create('SnakeBody', 1, 1);

    gameGround.remove(3, 1);
    gameGround.append(3, 1, tempHead);
    gameGround.remove(2, 1);
    gameGround.append(2, 1, tempBody1);
    gameGround.remove(1, 1);
    gameGround.append(1, 1, tempBody2);

    tempHead.next = tempBody1;
    tempHead.last = null;
    tempBody1.next = tempBody2;
    tempBody1.last = tempHead;
    tempBody2.next = null;
    tempBody2.last = tempBody1;

    this.head = tempHead;
    this.tail = tempBody2;

    this.direction = DirectionEnum.RIGHT;
}

snake.move = function (game) {
    const square = game.ground.squareTable[this.head.x + this.direction.x][this.head.y + this.direction.y];
    if (typeof this.strategy[square.touch()] === 'function') {
        this.strategy[square.touch()](game, this, false);
    }
}

snake.strategy = {
    Move: function(game, snake, fromEat) {
        const gameGround = game.ground;
        const head = snake.head;
        const tail = snake.tail;
        const direction = snake.direction;

        const tempHead = SquareFactory.create('SnakeHead', head.x + direction.x, head.y + direction.y);
        gameGround.remove(tempHead.x, tempHead.y);
        gameGround.append(tempHead.x, tempHead.y, tempHead);
        const tempBody = SquareFactory.create('SnakeBody', head.x, head.y);
        gameGround.remove(tempBody.x, tempBody.y);
        gameGround.append(tempBody.x, tempBody.y, tempBody);
           
        tempBody.next = head.next;
        head.next.last = tempBody; 
        tempHead.next = tempBody;
        tempBody.last = tempHead;   
        snake.head = tempHead;   
        
        if(!fromEat) {
            const tempFloor = SquareFactory.create('Floor', tail.x, tail.y);
            gameGround.remove(tempFloor.x, tempFloor.y);
            gameGround.append(tempFloor.x, tempFloor.y, tempFloor);
            tail.last.next = null;
            snake.tail = tail.last;
        }
        
    },
    Eat: function(game, snake) {
        this.scroe ++;
        this.move(game, snake, true);
        const food = new Food();
        food.init();
    },
    Dead: function(game) {
        game.over();
    }
}