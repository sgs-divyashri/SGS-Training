import "../../App.css"

const name = 'Divya';

export default function JSXExample() {
    return <div>
        <h1 className="bg-color">Welcome to {name}'s React Tutorial!!</h1>
        <p style={{backgroundColor: "plum", border: "2px solid black"}}>This is a sample text</p>
    </div>
}