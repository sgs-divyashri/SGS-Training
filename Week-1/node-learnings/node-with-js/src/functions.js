// let - local declaration
// var - global declaration
// const - value cannot be modified


function add(){
    var a =10
    var b = 20
    var c = a+b
    console.log(c)
}

function myname(){
    console.log("divya")
}

add()
myname()

function samsung(){
    console.log("Samsung's new launch!!")
}

function realme(){
    console.log("Realme's new series")
}

function poco(){
    console.log("Poco's new model!!")
}

poco()
samsung()
realme()


var fav_actor = "Vijay"
var f_player = "M S Dhoni"
var f_movie = "Unakum Enakum"

function favourites(){
    console.log("Favourite Actor: ", fav_actor)
    console.log("Favourite Player: ", f_player)
    console.log("Favourite Movie", f_movie)
}

favourites()


// Functions with Parameters

function sub(a,b){
    console.log(a-b)
}

sub(15, 3)

function area(l, b){
    let ar = l*b
    console.log("Area of Rectangle is: "+ar)
}

var len = 60
var breadth = 50
area(len, breadth)


// Return Type in Functions

function isName(){
    return "Divya"
}

isName() // Not returned in console

function NameIs(){
    return "Divya"
}

var letter = NameIs()
console.log(letter) // Printed in the console

function concatination(f_name, l_name){
    return f_name+" "+l_name
}

var f_name = "Divya"
var l_name = "Bhuvaneshwaran"
var concat = concatination(f_name, l_name)
console.log(concat)

