export default function TaskList({task, toggleTask}) {
    return <ul>
        {/* {demo_task.map((t, index) => <li key={index}>{t}</li>)} */}
        {task.map((taskItem, index) => <li onClick={() => toggleTask(taskItem['id'])} className="task-list-li" key={index}>{taskItem.text}</li>)}
    </ul>

    // {
    //     id: 2986e8,

    //     text: ""
    // }
}