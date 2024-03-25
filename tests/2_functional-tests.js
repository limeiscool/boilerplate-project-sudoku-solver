const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");

const strings = {
  good: puzzlesAndSolutions[0][0],
  solution: puzzlesAndSolutions[0][1],
  bad: "..9..5.1.85.4....2432......1...69.83.9....16862.719..9......1945....4.37.4.3..6..",
  badLength: "..9..5.1.85.4....2432......1...69.83.......1945....4.37.4.3..6..",
  invalidChar:
    "..9..5.1.85.4....2432......1...69.83.9....16.E2.719..9......1945....4.3A.4.3..6..",
};

chai.use(chaiHttp);

suite("Functional Tests", () => {
  //
  suite("POST /api/solve", () => {
    //
    test("Solve a puzzle with valid puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: strings.good })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "solution",
            "response should contain a solution property"
          );
          assert.equal(
            res.body.solution,
            strings.solution,
            "solution matches known solution"
          );
          done();
        });
    });
    //
    test("Solve a puzzle with missing puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send()
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "error",
            "response should contain an error property"
          );
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });
    //
    test("Solve a puzzle with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: strings.invalidChar })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "error",
            "response should contain an error property"
          );
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    //
    test("Solve a puzzle with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: strings.badLength })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "error",
            "response should contain an error property"
          );
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    //
    test("Solve a puzzle that cannot be solved", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: strings.bad })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "error",
            "response should contain an error property"
          );
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
    // END
  });
  //
  suite("POST /api/check", () => {});
  // END
});
