"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {});

  app.route("/api/solve").post((req, res) => {
    let puzzleStr = req.body.puzzle;
    let board = solver.solve(puzzleStr);
    solver.solvent(board, 0, 0);
    let solved = board.flat().join("");
    console.log(solved);
  });
};
