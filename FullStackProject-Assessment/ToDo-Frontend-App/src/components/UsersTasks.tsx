import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { api } from "../axios/axiosClient";
import { Task } from "../types/task";

export const ViewBoard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const res = await api.get("/tasks/me");
                const list = Array.isArray(res.data.tasks) ? res.data.tasks : [];

                const tasks: Task[] = list.map((t: any) => ({
                    taskId: t.taskId,                    
                    taskName: t.taskName,
                    taskDescription: t.description,
                    assignedTo: t.assignedTo ,
                    status: (t.status) as Task["status"],
                }));

                if (mounted) setTasks(tasks);
            } catch (e) {
                console.error("Failed to load tasks", e);

                if (mounted) setTasks([]); 
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    async function onDragEnd(result: any) {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId) return;

        setTasks(prev =>
            prev!.map(task =>
                task.taskId === draggableId
                    ? { ...task, status: destination.droppableId }
                    : task
            )
        );

        await api.put(`/status/update/${draggableId}`, {
            status: destination.droppableId,
        });
    }

    const todo = tasks!.filter(t => t.status === "To-Do");
    const inProgress = tasks!.filter(t => t.status === "In-Progress");
    const done = tasks!.filter(t => t.status === "Done");

    const columns = [
        { id: "To-Do", title: "To Do", items: todo },
        { id: "In-Progress", title: "In Progress", items: inProgress },
        { id: "Done", title: "Done", items: done },
    ];

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <h1 className="my-1 font-bold text-center">My Task Board</h1>
            <div className="flex gap-6 p-6">
                {columns.map(col => (
                    <Droppable droppableId={col.id} key={col.id}>
                        {provided => (
                            <div
                                className="w-1/3 bg-gray-100 p-4 rounded"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <h2 className="font-bold mb-3">{col.title}</h2>

                                {col.items.map((task, index) => (
                                    <Draggable key={task.taskId} draggableId={task.taskId!} index={index}>
                                        {provided => (
                                            <div
                                                className="p-3 bg-white rounded shadow mb-2"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <p className="text-sm text-gray-500">Task ID: {task.taskId}</p>
                                                <p className="font-semibold">{task.taskName}</p>
                                                <p className="text-sm text-gray-500">{task.taskDescription}</p>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};