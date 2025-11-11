function dosomething() {
    for (var i = 0; i < 5; i++) { // global declaration
        console.log(i);
    }
    console.log('Finally: ', i);
}
dosomething();
// function demo(){
//     for(let i=0; i<5; i++){  // local declaration
//         console.log(i)
//     }
//     console.log('Finally: ', i)
// }
// demo();
function demo() {
    for (var i = 0; i < 5; i++) { // local declaration
        console.log(i);
    }
}
demo();
var cnt = 24; // type - number
// cnt = 'a'  // Type string not assignable to type number - not an error in .js file
var a = 'hi'; // type - string
var b; // type - any  // no errors  // but not preferred
b = 1;
b = 'good';
b = true;
var x;
var y;
var z;
var arr = [1, 3, 4, 6];
// let t:number[] = [1, 3, 2, 'z'] // Type error
var f = [1, 2, 5, 'z', 2.4, 9.1, 'yes', true]; // not preferred
var colorRed = 0;
var colorBlue = 1;
var colorGreen = 2;
// Enumerations
/*
   - a special "class"
   - to define a collection of named constants (unchangeable variables)
   - come in two flavors string and numeric.
   - By default, enums will initialize the first value to 0 and add 1 to each additional value
*/
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {})); // index - 0, 1, 2  // numeric
var backgroundcolor = Color.Red;
console.log(backgroundcolor); // 0
var Colors;
(function (Colors) {
    Colors[Colors["Red"] = 100] = "Red";
    Colors[Colors["Green"] = 101] = "Green";
    Colors[Colors["Blue"] = 202] = "Blue";
})(Colors || (Colors = {})); // assigning values
var bgcolor = Colors.Green;
console.log(bgcolor); // 101
var directions;
(function (directions) {
    directions["North"] = "North";
    directions["East"] = "East";
    directions["South"] = "South";
    directions["West"] = "West";
})(directions || (directions = {}));
;
// logs "North"
console.log(directions.North);
// logs "West"
console.log(directions.West);
