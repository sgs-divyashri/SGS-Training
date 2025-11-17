// Syntax

if (true){ //conditions
    console.log("It's true")  //if true
}

if (false){
    console.log("It's true")  //if true
}
else{
    console.log("It's False")  //if false
}


//Example 1
console.log("-------Example-------")

var rain = true
if (rain){
    console.log("Take an umbrella")
}
else{
    console.log("Enjoy the sunshine")
}


var rain = false
if (rain){
    console.log("Take an umbrella")
}
else{
    console.log("Enjoy the sunshine")
}

// Example 2
console.log("-------Example-------")

if (hw = false){
    console.log("Great Job!")
}
else{
    console.log("Finsih your homework before playing")
}

// Example 3
console.log("-------Example-------")

var bday = true
if (bday){
    console.log("Happy Birthday tou you! Enjoy your special day!")
}
else{
    console.log("Have a great day!")
}

console.log("-------Example-------")

function trafficSignal(light){
    if (light == "Red"){
        console.log("Stop!!")
    }
    else if (light == "Yellow"){
        console.log("Get Ready")
    }
    else if (light == "Green"){
        console.log("Go!!")
    }
    else{
        console.log("No such traffic rule.")
    }
}

trafficSignal("Yellow")
trafficSignal("Pink")
trafficSignal("Green")
trafficSignal("Red")

console.log("-------Example-------")

function isSeason(season){
    if (season == "Spring"){
        console.log("Enjoy blooming flowers")
    }
    else if (season == "summer"){
        console.log("Have fun in the sun")
    }
    else if (season == "winter"){
        console.log("Bundle up and stay warm")
    }
    else{
        console.log("Admire the colorful leaves")
    }
}

isSeason("winter")
isSeason("Spring")
isSeason("summer")
isSeason("autumn")

console.log("-------Example-------")

function gameScore(score){
    if (score < 50){
        console.log("You need to improve")
    }
    else if (score >= 50 && score <=70){
        console.log("Good job!!")
    }
    else{
        console.log("Great Performance!!")
    }
}

gameScore(50)
gameScore(20)
gameScore(68)
gameScore(72)
gameScore(98)

console.log("-------Example-------")

function eveOdd(num){
    if (num % 2 == 0){
        console.log(`The number ${num} is Even`)
    }
    else{
        console.log(`The number ${num} is Odd`)
    }
}
eveOdd(78)
eveOdd(65)
eveOdd(15)
eveOdd(38)

console.log("-------Example-------")

function alpha(ch){
    if (ch == 'A' || ch == 'E'|| ch == 'I'|| ch == 'O' || ch == 'U' || ch == 'a' || ch == 'e'|| ch == 'i'|| ch == 'o' || ch == 'u'){
        console.log("It's a vowel")
    }
    else{
        console.log("It's a consonant")
    }
}
alpha('d')
alpha('H')
alpha('e')
alpha('w')
alpha('U')