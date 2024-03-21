"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();
  const rowMatch = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    G: 6,
    H: 7,
    I: 8,
  };

  app.route("/api/check").post((req, res) => {
    let { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value) {
      res.json({ error: "Required field missing" });
    }
    if (puzzle.length !== 81) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
    }
    let board = solver.strTo2d(puzzle);
    // check for invalid characters in puzzle, err, Invalid characters in puzzle
    let [row, col] = coordinate.split("");
    row = rowMatch[row.toUpperCase()];
    col -= 1;
    value = Number(value);
    // check if coordinate is valid;
    // check is value is 1-9
    if (board[row][col] === value) {
      res.json({ valid: true });
    }
    let conflicts = solver.validPlacement(board, row, col, value);
    if (!conflicts.length) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false, conflict: conflicts });
    }
  });

  app.route("/api/solve").post((req, res) => {
    let puzzleStr = req.body.puzzle;
    if (!puzzleStr) {
      res.json({ error: "Required field missing" });
    }
    if (puzzleStr.length !== 81) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
    }
    let board = solver.strTo2d(puzzleStr);
    let valid = solver.validate(board);
    if (!valid) {
      res.json({ error: "Puzzle cannot be solved" });
    }
    solver.solvent(board, 0, 0);
    let solved = board.flat().join("");
    console.log(solved);
    res.json({ solution: solved });
  });
};
