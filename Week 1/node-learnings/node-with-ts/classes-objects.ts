interface Shield {
  // fields of data type and values
  a: number,
  b: number,
  c: number,
  desk: () => void
}

let drawRect = (point: Shield) => {
    //
}

let someFunc = () => {
    //
}

drawRect({a: 20, b: 30, c: 35, desk: someFunc})


// class

class Example {
  // fields of data type and values
  x: number = 0;
  y: number = 0;
  z: number = 0;
  draw = () => {
    console.log('X: ' + this.x, 'Y: ' + this.y, 'Z: '+ this.z);
  };
  drawSquare = () => {
    this.draw()
  }
}