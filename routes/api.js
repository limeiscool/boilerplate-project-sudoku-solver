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
      return res.json({ error: "Required field(s) missing" });
    }
    let lengthCheck = solver.isLength81(puzzle);
    if (!lengthCheck) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    // check for invalid characters in puzzle, err, Invalid characters in puzzle
    let validCharacters = solver.validateCharacters(puzzle);
    if (!validCharacters) {
      return res.json({ error: "Invalid characters in puzzle" });
    }
    if (coordinate.length !== 2) {
      return res.json({ error: "Invalid coordinate" });
    }
    // row must be a letter A-I and col must be a number 1-9
    let [row, col] = coordinate.split("");
    if (
      !isNaN(Number(row)) ||
      rowMatch[row.toUpperCase()] === undefined ||
      isNaN(Number(col))
    ) {
      return res.json({ error: "Invalid coordinate" });
    }
    row = rowMatch[row.toUpperCase()];
    col -= 1;
    value = Number(value);
    // check if coordinate is valid;
    if (row < 0 || col < 0 || row > 8 || col > 8) {
      return res.json({ error: "Invalid coordinate" });
    }
    // check is value is 1-9
    if (isNaN(value) || value < 1 || value > 9) {
      return res.json({ error: "Invalid value" });
    }
    let board = solver.strTo2d(puzzle);
    if (board[row][col] === value) {
      return res.json({ valid: true });
    }
    let conflicts = solver.validPlacement(board, row, col, value);
    if (!conflicts.length) {
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false, conflict: conflicts });
    }
  });

  app.route("/api/solve").post((req, res) => {
    let puzzleStr = req.body.puzzle;
    if (!puzzleStr) {
      return res.json({ error: "Required field missing" });
    }
    let lengthCheck = solver.isLength81(puzzleStr);
    if (!lengthCheck) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    let validCharacters = solver.validateCharacters(puzzleStr);
    if (!validCharacters) {
      return res.json({ error: "Invalid characters in puzzle" });
    }
    let board = solver.strTo2d(puzzleStr);
    let valid = solver.validate(board);
    if (!valid) {
      return res.json({ error: "Puzzle cannot be solved" });
    }
    solver.solvent(board, 0, 0);
    let solved = board.flat().join("");
    return res.json({ solution: solved });
  });
};
