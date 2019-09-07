window.onload = function() {

    let fild = new Fild();
}

class Fild
{
    constructor()
    {
        this.divGame = document.querySelector("#tetris");

        this.currentScores = 0;
        this.maxScores = 0;
        
        this.currentPeace = this.newShape();
        this.nextPeace = this.newShape();
        
        this.currentPeaceX = 3;
        this.currentPeaceY = 0;
        
        this.tableBoard = new Array(20);
        
        this.currentScoresP = null;
        this.maxScoresP = null;
        this.gameRunTimer = null;
        this.createStartButton();

        this.board = new Array(20);
        for(let row = 0; row < 20; ++row)
            this.board[row] = new Array(10);
    }

    createStartButton() {

        let startbBtn = document.createElement("button");
        startbBtn.id = "startButton";
        startbBtn.innerText = "Start Game";
        let fild = this;
        startbBtn.onclick = function() {
            this.parentNode.removeChild(this);
            fild.createGameFild();
            fild.run();
        }
        this.divGame.appendChild(startbBtn);

    }

    newShape()
    {
        let type = Math.round(Math.random() * 6);
        switch(type)
        {
            case 0:
                return [
                    [1, 1, 0],
                    [0, 1, 1],
                    [0, 0, 0]
                ];
        
            case 1:
                return [
                    [0, 2, 2],
                    [2, 2, 0],
                    [0, 0, 0]
                ];
            
            case 2:
                return [
                    [3, 3, 3],
                    [0, 0, 3],
                    [0, 0, 0]
                ];
        
            case 3:
                return [
                    [4, 4, 4],
                    [4, 0, 0],
                    [0, 0, 0]
                ];
            
            case 4:
                return [
                    [5, 5],
                    [5, 5],
                ];
        
            case 5:
                return [
                    [6, 6, 6],
                    [0, 6, 0],
                    [0, 0, 0]
                ];

            case 6:
                return [
                    [7, 7, 7, 7],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ];
            
        }
    }

    rotate()
    {
        let sz = this.currentPeace.length;

        let oldForm = Array(sz);
        for(let row = 0; row < sz; ++row)
        {
            oldForm[row] = new Array(sz);
            for(let col = 0; col < sz; ++col)
                oldForm[row][col] = this.currentPeace[row][col];
        }

        for(let row = 0; row < sz; ++row)
            for(let col = 0; col < sz; ++col)
                this.currentPeace[col][sz - 1 - row] = oldForm[row][col];

        let flag = true;
        let cnt = 0;
        while(flag)
        {
            for(let col = 0; col < sz; ++col)
                if(this.currentPeace[cnt][col] !== 0)
                    flag = false;
            if(flag)
                ++cnt;
        }
        for(let col = 0; col < sz; ++col)
        {
            let row = 0;
            while(row + cnt != sz)
            {
                this.currentPeace[row][col] = this.currentPeace[row + cnt][col];
                ++row;
            }
            while(row != sz)
                this.currentPeace[row++][col] = 0;
        }
        
        flag = true;
        cnt = 0;
        while(flag)
        {
            for(let row = 0; row < sz; ++row)
                if(this.currentPeace[row][cnt] !== 0)
                    flag = false;
            if(flag)
                ++cnt;
        }
        for(let row = 0; row < sz; ++row)
        {
            let col = 0;
            while(col + cnt != sz)
            {
                this.currentPeace[row][col] = this.currentPeace[row][col + cnt];
                ++col
            }
            while(col != sz)
                this.currentPeace[row][col++] = 0;
        }
        
        if(this.checkPos())
        {
            ++this.currentPeaceX;
            if(this.checkPos())
            {
                this.currentPeaceX -= 2;
                if(this.checkPos())
                    {
                        ++this.currentPeaceX;
                        this.currentPeace = oldForm;
                    }
            }
        }
        this.render();
    }

    fixState()
    {
        let sz = this.currentPeace.length;
        let xPos = this.currentPeaceX;
        let yPos = this.currentPeaceY;
        for(let row = 0; row < sz; ++row)
            for(let col = 0; col < sz; ++col)
                if((this.currentPeace[row][col] !== 0) && (xPos + col < this.board[0].length) && (yPos + row < this.board.length))
                    this.board[yPos + row][xPos + col] = this.currentPeace[row][col];
        
        this.currentPeace = this.nextPeace;
        this.currentPeaceX = 3;
        this.currentPeaceY = 0;
        
        this.nextPeace = this.newShape();
        if(this.checkPos())
            this.stop();
        
        this.deleteLines();
    }

    checkPos()
    {
        let sz = this.currentPeace.length;
        let xPos = this.currentPeaceX;
        let yPos = this.currentPeaceY;
        if (xPos < 0)
            return true;
        for(let row = 0; row < sz; ++row)
            for(let col = 0; col < sz; ++col) {
                if(this.currentPeace[row][col] !== 0 && (xPos + col >= this.board[0].length || yPos + row >= this.board.length))
                    return true;
                if(this.currentPeace[row][col] !== 0 && this.board[yPos + row][xPos + col] !== 0)
                    return true;
            }
        return false;
    }

    render()
    {
        for(let row = 0; row < 20; ++row)
            for(let col = 0; col < 10; ++col)
                switch(this.board[row][col]) {
                    case 1:
                        this.tableBoard[row][col].classList.add("red");
                        break;
                    case 2:
                        this.tableBoard[row][col].classList.add("blue");
                        break;
                    case 3:
                        this.tableBoard[row][col].classList.add("green");
                        break;
                    case 4:
                        this.tableBoard[row][col].classList.add("yellow");
                        break;
                    case 5:
                        this.tableBoard[row][col].classList.add("orange");
                        break;
                    case 6:
                        this.tableBoard[row][col].classList.add("pink");
                        break;
                    case 7:
                        this.tableBoard[row][col].classList.add("lightblue");
                        break;
                    default:
                        this.tableBoard[row][col].className = "gameSquare";
                }
    
        let xPos = this.currentPeaceX;
        let yPos = this.currentPeaceY;
        let sz = this.currentPeace.length;

        for(let row = 0; row < sz; ++row)
            for(let col = 0; col < sz; ++col)
                switch(this.currentPeace[row][col]) {
                    case 1:
                            this.tableBoard[yPos + row][xPos + col].classList.add("red");
                        break;
                    case 2:
                        this.tableBoard[yPos + row][xPos + col].classList.add("blue");
                        break;
                    case 3:
                        this.tableBoard[yPos + row][xPos + col].classList.add("green");
                        break;
                    case 4:
                        this.tableBoard[yPos + row][xPos + col].classList.add("yellow");
                        break;
                    case 5:
                        this.tableBoard[yPos + row][xPos + col].classList.add("orange");
                        break;
                    case 6:
                        this.tableBoard[yPos + row][xPos + col].classList.add("pink");
                        break;
                    case 7:
                        this.tableBoard[yPos + row][xPos + col].classList.add("lightblue");
                        break;
                }
        
        this.currentScoresP.innerText = "Scores: " + this.currentScores;
        this.maxScoresP.innerText = "Max Scores: " + this.maxScores;
    }

    moveDown()
    {
        ++this.currentPeaceY;
        if(this.checkPos()) {
            --this.currentPeaceY;
            this.fixState();
        }
        this.render();
    }

    moveLeft()
    {
        --this.currentPeaceX
        if(this.checkPos())
            ++this.currentPeaceX;
        this.render();
    }

    moveRight()
    {
        ++this.currentPeaceX;
        if(this.checkPos())
            --this.currentPeaceX;
        this.render();
    }

    moveDrop()
    {
        while(!this.checkPos())
            ++this.currentPeaceY;
        --this.currentPeaceY;
        this.fixState();
        this.render();
    }
    createGameFild()
    {
        for(let row = 0; row < 20; ++row)
            for(let col = 0; col < 10; ++col)
                this.board[row][col] = 0;
        
        let body = document.querySelector("body");

        let gameBoard = document.createElement("table");
        gameBoard.id = "gameBoard";

        
        this.currentScoresP = document.createElement("p");
        this.maxScoresP = document.createElement("p");

        this.currentScoresP.className = this.maxScoresP.className = "scoresDisplays";
        
        let gameHeader = document.createElement("header");
        gameHeader.id = "gameHeader";

        this.currentScoresP.innerText = "Scores: 0";
        this.maxScoresP.innerText = "Max Scores: " + this.maxScores;

        gameHeader.appendChild(this.currentScoresP);
        gameHeader.appendChild(this.maxScoresP);

        this.divGame.appendChild(gameHeader);

        for(let i = 0; i < 20; ++i)
        {
            let gameBoardRow = document.createElement("tr");
            gameBoardRow.className = "gameRow";

            for(let j = 0; j < 10; ++j)
            {
                let gameBoardItem = document.createElement("td")
                gameBoardItem.className = "gameSquare";
                gameBoardRow.appendChild(gameBoardItem);
            }

            gameBoard.appendChild(gameBoardRow);
        }
        
        this.divGame.appendChild(gameBoard);
        body.appendChild(this.divGame);

        let tblRows = document.querySelector("#gameBoard").childNodes;
        for (let row = 0; row < 20; ++row)
            this.tableBoard[row] = tblRows[row].childNodes;

        let fild = this;

        document.querySelector("body").onkeydown = function(e) {

            switch(e.code) {
                case "ArrowUp":
                    fild.rotate();
                    break;
                case "ArrowDown":
                    fild.moveDown();
                    break;
                case "ArrowLeft":
                    fild.moveLeft();
                    break;
                case "ArrowRight":
                    fild.moveRight();
                    break;
                case "Space":
                    fild.moveDrop();
                    break;
            }
        }
    }

    run() {
        this.gameRunTimer = setInterval(() => this.moveDown(), 1000);
    }
    stop() {
        clearInterval(this.gameRunTimer);
        if(this.currentScores > this.maxScores)
            this.maxScores = this.currentScores;
        this.currentScores = 0;
        let ch = this.divGame.childNodes;
        for(let i = ch.length - 1; i >= 0; --i)
            this.divGame.removeChild(ch[i]);
        this.createStartButton();
    }

    deleteLines() {
        let rowCnt = this.board.length;
        let colCnt = this.board[0].length; 
        let linesCnt = 0
        for(let row = 0; row < rowCnt; ++row) {
            let col = 0;
            while(col < colCnt && this.board[row][col] !== 0)
                ++col;
            if(col == colCnt) {
                let i = row;
                while(i != 0) {
                    for(let col = 0; col < colCnt; ++col)
                        this.board[i][col] = this.board[i - 1][col];
                    --i;
                }
                for(let col = 0; col < colCnt; ++col)
                    this.board[0][col] = 0;
                ++linesCnt;
            }
        }
        if(linesCnt != 0)
            this.currentScores += Math.pow(2, linesCnt);
    }

}
