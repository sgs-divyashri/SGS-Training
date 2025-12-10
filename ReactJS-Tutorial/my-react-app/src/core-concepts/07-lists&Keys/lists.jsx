export default function Lists() {
    const items = ['apple', 'banana', 'cherry', 'plum']
    return <>
        <h1>Lists & Keys</h1>
        {/* Unordered List */}
        <ul>
            {items.map((item, index) => <li key = {index}>{item}</li>)}
        </ul>
    </>
}