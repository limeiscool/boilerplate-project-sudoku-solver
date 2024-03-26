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
  goodCheck:
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
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
  suite("POST /api/check", () => {
    //
    test("Check a puzzle placement with all fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: strings.goodCheck, coordinate: "E5", value: "4" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "valid",
            "response should contain a valid property"
          );
          assert.isTrue(res.body.valid, "placement is valid");
          done();
        });
    });
    //
    test("Check a puzzle placement with a single placement conflict", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: strings.goodCheck, coordinate: "B7", value: "6" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "conflict",
            "response should contain a conflict property"
          );
          assert.isFalse(res.body.valid, "placement is invalid");
          assert.isArray(
            res.body.conflict,
            "response conflict should be an array"
          );
          assert.equal(
            res.body.conflict.length,
            1,
            "there is a single conflict"
          );
          assert.equal(
            res.body.conflict[0],
            "column",
            "conflict is in the column"
          );
          done();
        });
    });
    //
    test("Check a puzzle placement with multiple placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: strings.goodCheck, coordinate: "B7", value: "1" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "conflict",
            "response should contain a conflict property"
          );
          assert.isFalse(res.body.valid, "placement is invalid");
          assert.isArray(
            res.body.conflict,
            "response conflict should be an array"
          );
          assert.equal(
            res.body.conflict.length,
            2,
            "there is multiple conflicts"
          );
          assert.include(
            res.body.conflict,
            "column",
            "conflict is in the column and region"
          );
          assert.include(
            res.body.conflict,
            "region",
            "conflict is in the column and region"
          );
          done();
        });
    });
    //
    test("Check a puzzle placement with all placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: strings.goodCheck, coordinate: "E5", value: "6" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "conflict",
            "response should contain a conflict property"
          );
          assert.isFalse(res.body.valid, "placement is invalid");
          assert.isArray(
            res.body.conflict,
            "response conflict should be an array"
          );
          assert.equal(res.body.conflict.length, 3, "there is all conflicts");
          assert.include(
            res.body.conflict,
            "column",
            "conflict is in the column, region and row"
          );
          assert.include(
            res.body.conflict,
            "region",
            "conflict is in the column, region and row"
          );
          assert.include(
            res.body.conflict,
            "row",
            "conflict is in the column, region and row"
          );
          done();
        });
    });
    //
    test("Check a puzzle placement with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: strings.goodCheck })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "error",
            "response should contain an error property"
          );
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });
    //
    test("Check a puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: strings.invalidChar, coordinate: "B7", value: "4" })
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
    test("Check a puzzle placement with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: strings.badLength, coordinate: "B7", value: "4" })
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
    test("Check a puzzle placement with invalid placement coordinate", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: strings.good, coordinate: "J7", value: "4" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "error",
            "response should contain an error property"
          );
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });
    //
    test("Check a puzzle placement with invalid placement value", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: strings.goodCheck, coordinate: "E7", value: "45" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "error",
            "response should contain an error property"
          );
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
  // END
});
