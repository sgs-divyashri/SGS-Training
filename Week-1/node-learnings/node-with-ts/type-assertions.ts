// Type Assertions 
/* - to set the type of a value and tell the compiler not to infer it.
   - similar to type casting in other languages like C# and Java.
*/

let color = 'red' // type - sring
let endswithD = color.endsWith('d')

let colors; // type - any
colors = 'blue';
let ends = (<string> colors).endsWith('e')
let alt_ends = (colors as string).endsWith('e')
