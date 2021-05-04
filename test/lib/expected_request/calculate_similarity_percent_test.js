import jutest from "jutest";
import calculateSimilarityPercent from "expected_request/calculate_similarity_percent";

jutest("calculateSimilarityPercent()", function(t) {
  let calculate = calculateSimilarityPercent;

  t.test("returns 0 if matches are empty", function(t) {
    t.equal(calculate({}), 0);
  });

  t.test("returns 100 if every match is truthy", function(t) {
    t.equal(calculateSimilarityPercent({foo: true, bar: true, baz: true}), 100);
  });

  t.test("assigns each match an equal weight based on total number of matches", function(t) {
    t.equal(calculate({foo: true, bar: false}), 50);
    t.equal(calculate({foo: true, bar: false, baz: true}), 66.7);
    t.equal(calculate({foo: true, bar: false, baz: false}), 33.3);
  });

  t.test("allows setting fixed weight to any match", function(t) {
    t.equal(calculate({foo: true, bar: false}, {foo: 70}), 70);
    t.equal(calculate({foo: false, bar: true}, {foo: 70}), 30);
    t.equal(calculate({foo: true, bar: false, baz: true, foobar: false}, {foo: 70}), 80);
    t.equal(calculate({foo: true, bar: true, baz: false, foobar: true}, {foo: 44, bar: 33}), 88.5);
  });
});
