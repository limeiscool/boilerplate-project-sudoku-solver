const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const sudokuSolver = new Solver();
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");
const puzzle =
  "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const board = sudokuSolver.strTo2d(puzzle);
const row = 4;
const col = 4;

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", (done) => {
    assert.isTrue(sudokuSolver.isLength81(puzzle));
    done();
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
    const invalidPuzzle =
      "..9..5.1.85.4....2E32......1...69.83.a.....6.62.71...9......19E5....4.37.4.3..6..";
    assert.isFalse(sudokuSolver.validateCharacters(invalidPuzzle));
    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
    const invalidPuzzle = "0.9..5.1.85.4....2432.........1945....4.37.4.3..6..";
    assert.isFalse(sudokuSolver.isLength81(invalidPuzzle));
    done();
  });

  test("Logic handles a valid row placement", (done) => {
    const value = 4;
    let conflicts = sudokuSolver.validPlacement(board, row, col, value);
    assert.isArray(conflicts);
    assert.equal(conflicts.length, 0);
    done();
  });

  test("Logic handles an invalid row placement", (done) => {
    const value = 9;
    let conflicts = sudokuSolver.validPlacement(board, row, col, value);
    assert.isArray(conflicts);
    assert.isTrue(conflicts.includes("row"));
    done();
  });

  test("Logic handles a valid column placement", (done) => {
    const value = 4;
    let conflicts = sudokuSolver.validPlacement(board, row, col, value);
    assert.isArray(conflicts);
    assert.equal(conflicts.length, 0);
    done();
  });

  test("Logic handles an invalid column placement", (done) => {
    const value = 6;
    let conflicts = sudokuSolver.validPlacement(board, row, col, value);
    assert.isArray(conflicts);
    assert.isTrue(conflicts.includes("column"));
    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", (done) => {
    const value = 4;
    let conflicts = sudokuSolver.validPlacement(board, row, col, value);
    assert.isArray(conflicts);
    assert.equal(conflicts.length, 0);
    done();
  });

  test("Logic handles an invalid region (3x3 grid) placement", (done) => {
    const value = 7;
    let conflicts = sudokuSolver.validPlacement(board, row, col, value);
    assert.isArray(conflicts);
    assert.isTrue(conflicts.includes("region"));
    done();
  });

  test("Valid puzzle strings pass the solver", (done) => {
    puzzlesAndSolutions.forEach((arr) => {
      let [puzzleStr, solution] = arr;
      let board = sudokuSolver.strTo2d(puzzleStr);
      let validated = sudokuSolver.validate(board);
      assert.isTrue(validated);
    });
    done();
  });

  test("Invalid puzzle strings fail the solver", (done) => {
    let invalidPuzzle =
      "..9..5.1.85.4....2432......1...69.83.9....16.62.719..9......1945....4.37.4.3..6..";
    let board = sudokuSolver.strTo2d(invalidPuzzle);
    let validated = sudokuSolver.validate(board);
    assert.isFalse(validated);
    done();
  });

  test("Solver returns the expected solution for an incomplete puzzle", (done) => {
    puzzlesAndSolutions.forEach((arr) => {
      let [puzzleStr, solution] = arr;
      let board = sudokuSolver.strTo2d(puzzleStr);
      sudokuSolver.solvent(board, 0, 0);
      let solved = board.flat().join("");
      assert.equal(solved, solution);
    });
    done();
  });
});
