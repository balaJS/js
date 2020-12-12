console.log('performance starts: ' + performance.now());
for (var i = 0; i < 10000; i++);
console.log('performance ends: ' + performance.now());
// Atom DEV tool::test result:0.7550000008195639

console.log('performance starts: ' + performance.now());
for (var i = 0; i < 1000000; i++);
console.log('performance ends: ' + performance.now());
// Atom DEV tool::test result:6.424999998882413

// Sample data for while, for and forEach.
var testArr = [];
testArr.length = 10000;
// console.log('test result:'+ ( - ));

// For loop benchmark starts here.
console.log('performance starts: ' + performance.now());
for (var i = 0; i < testArr.length; i++);
console.log('performance ends: ' + performance.now());
// Atom DEV tool::test result:1.2049999926239252
// Chrome::test result:0.9449999997741543

console.log('performance starts: ' + performance.now());
var len = testArr.length;
for (var i = 0; i < len; i++);
console.log('performance ends: ' + performance.now());
// Atom DEV tool::test result:0.655000003403984
// Atom DEV tool:test result:0.6649999995715916
// Chrome::test result:0.7649999970453791
// Chrome::test result:0.7849999965401366

// ForEach loop benchmark starts here.
console.log('performance starts: ' + performance.now());
testArr.forEach(function(val) {
});
console.log('performance ends: ' + performance.now());
// Atom DEV tool::test result:0.2299999978276901
// Atom DEV tool::test result:0.22000000171829015
// FF::test result:3
// Chrome::test result:0.26000000070780516

console.log('performance starts: ' + performance.now());
testArr.forEach(function(val) {
  val++;
});
console.log('performance ends: ' + performance.now());
// Atom DEV tool::test result:0.22000000160187483
// FF::test result:4
// Chrome::test result:0.22499999613501132

console.log('performance starts: ' + performance.now());
testArr.forEach(function() {
});
console.log('performance ends: ' + performance.now());
// Atom DEV tool::test result:0.23499999952036887
// Atom DEV tool::test result:0.24000000121304765

// While loop benchmark starts here.
console.log('performance starts: ' + performance.now());
var i = 0;
var len = testArr.length;
while (i < len) {
  i++;
}
console.log('performance ends: ' + performance.now());
// Atom DEV tool::test result:0.6849999990081415
// Chrome::test result:0.6899999934248626

console.log('performance starts: ' + performance.now());
var len = testArr.length;
while (len--) {

}
console.log('performance ends: ' + performance.now());
// Atom DEV tool::test result:0.5999999993946403
// Atom DEV tool::test result:0.5850000015925616
// Atom DEV tool::test result:0.6700000012642704
// Atom DEV tool::test result:0.5899999960092828
// FF::test result:7
// Chrome::test result:0.5899999958928674

console.log('performance starts: ' + performance.now());
var len = testArr.length;
while (len--);
console.log('performance ends: ' + performance.now());
// Atom DEV tool::test result:0.8800000068731606
// Atom DEV tool::test result:0.7349999941652641
// FF::test result:6
// Chrome::test result:0.6250000004656613



console.log('test result:'+ ( - ));
