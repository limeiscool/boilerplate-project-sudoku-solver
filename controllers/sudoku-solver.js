class SudokuSolver {
  isLength81(puzzleString) {
    return puzzleString.length === 81;
  }

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

  validateCharacters(puzzleString) {
    let regex = /^[1-9.]*$/;
    return regex.test(puzzleString);
  }

  validate(board) {
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

  validPlacement(board, row, col, num) {
    let conflicts = [];
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        conflicts.push("column");
      }
      if (board[row][i] === num) {
        conflicts.push("row");
      }
      if (
        board[3 * Math.floor(row / 3) + Math.floor(i / 3)][
          3 * Math.floor(col / 3) + (i % 3)
        ] === num
      ) {
        conflicts.push("region");
      }
    }
    return conflicts;
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
        if (this.validPlacement(board, r, c, i).length === 0) {
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
}

module.exports = SudokuSolver;
