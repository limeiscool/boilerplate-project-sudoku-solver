class SudokuSolver {
  strTo2d(puzzleString) {
    const board = [];
    for (let i = 0; i < 9; i++) {
      const row = [];
      for (let j = 0; j < 9; j++) {
        const index = i * 9 + j;
        row.push(puzzleString[index] === "." ? 0 : Number(puzzleString[index]));
      }
      board.push(row);
    }
    return board;
  }

  validate(puzzleString) {
    // convert to 2d array
    const board = this.strTo2d(puzzleString);
    console.log(board);

    for (let i = 0; i < 9; i++) {
      if (board[i].includes(NaN)) {
        return false;
      }
    }

    // check row col dupslicates
    for (let i = 0; i < 9; i++) {
      const rowSet = new Set();
      const colSet = new Set();

      for (let j = 0; j < 9; j++) {
        //row
        if (!!board[i][j] && rowSet.has(board[i][j])) {
          return false;
        }
        rowSet.add(board[i][j]);
        //col
        if (!!board[j][i] && colSet.has(board[j][i])) {
          return false;
        }
        colSet.add(board[j][i]);
      }
    }

    // check subgrid
    // each sub
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        const subgridSet = new Set();
        // row and col of each sub
        for (let x = i; x < i + 3; x++) {
          for (let y = j; y < j + 3; y++) {
            if (!!board[x][y] && subgridSet.has(board[x][y])) {
              return false;
            }
            subgridSet.add(board[x][y]);
          }
        }
      }
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {
    // join the 2d array
  }
}

module.exports = SudokuSolver;
