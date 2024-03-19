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

  validate(board) {
    // convert to 2d array

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

    return board;
  }

  validator(puzzleString) {
    const board = this.strTo2d(puzzleString);
    if (this.validate(board)) {
      return board;
    }
    return false;
  }

  validPlacement(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        return false;
      }
      if (board[row][i] === num) {
        return false;
      }
      if (
        board[3 * Math.floor(row / 3) + Math.floor(i / 3)][
          3 * Math.floor(col / 3) + (i % 3)
        ] === num
      ) {
        return false;
      }
    }
    return true;
  }

  solvent(board, r, c) {
    if (r === 9) {
      return true;
    } else if (c === 9) {
      return this.solvent(board, r + 1, 0);
    } else if (board[r][c] !== 0) {
      return this.solvent(board, r, c + 1);
    } else {
      for (let i = 1; i <= 9; i++) {
        if (this.validPlacement(board, r, c, i)) {
          board[r][c] = i;
          if (this.solvent(board, r, c + 1)) {
            return true;
          }
          board[r][c] = 0;
        }
      }
      return false;
    }
  }

  solve(puzzleString) {
    let board = this.validator(puzzleString);
    if (!board) {
      return "Invalid Puzzle";
    }

    return board;
  }
}

module.exports = SudokuSolver;
