import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Drawer, Box, IconButton, TextField, MenuItem, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { api } from "../axios/axiosClient";
import { Task } from "../types/task";
import { EditOutlined } from "@mui/icons-material";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";

export const ManageBoard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<{ userId: string; name: string; email: string }[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [form, setForm] = useState({ taskName: "", description: "", assignedTo: "", status: "To-Do" as Task["status"] });
    const nameRef = React.useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (drawerOpen) {
            requestAnimationFrame(() => nameRef.current?.focus());
        }
    }, [drawerOpen]);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/users');
                setUsers(Array.isArray(res.data?.users) ? res.data.users : []);
            } catch (e) {
                console.error('Failed to load users', e);
            }
        })();
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await api.get("/tasks");
                const list = Array.isArray(res.data.tasks) ? res.data.tasks : [];

                const tasks: Task[] = list.map((t: any) => ({
                    taskId: t.taskId,
                    taskName: t.taskName,
                    taskDescription: t.description,
                    assignedTo: t.assignedTo,
                    status: (t.status) as Task["status"],
                    assigneeEmail: t.User.email,
                    assigneeName: t.User.name,
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


    const openDrawer = (task: Task) => {
        setEditingTaskId(task.taskId!);
        setForm({
            taskName: task.taskName ?? "",
            description: task.taskDescription ?? "",
            assignedTo: task.assigneeEmail ?? "",
            status: task.status,
        });
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditingTaskId(null);
    };

    const handleEditTasks = async () => {
        if (!editingTaskId) return;

        if (!form.taskName.trim()) {
            toast.error("Task name is required");
            return;
        }

        const payload = {
            taskName: form.taskName.trim(),
            description: form.description.trim(),
            assignedTo: form.assignedTo.trim(),
            status: form.status,
        };

        Object.keys(payload).forEach((k) => {
            const key = k as keyof typeof payload;
            if (payload[key] === "") delete payload[key];
        });

        const prevTasks = tasks;
        setTasks((prev) =>
            prev.map((t) =>
                t.taskId === editingTaskId
                    ? {
                        ...t,
                        taskName: payload.taskName ?? t.taskName,
                        taskDescription: payload.description ?? t.taskDescription,
                        assignedTo: payload.assignedTo ?? t.assignedTo,
                        status: payload.status ?? t.status,
                    }
                    : t
            )
        );

        try {
            await api.patch(`/tasks/edit/${editingTaskId}`, payload);
            toast.success("Task updated");
            closeDrawer();
        } catch (err: any) {
            setTasks(prevTasks);
            console.error("Edit task failed", { error: err?.message });
            const serverMsg = "Failed to update Task";
            toast.error(serverMsg);
        }
    };

    async function onDragEnd(result: any) {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId) return;

        setTasks(prev => prev!.map(task => task.taskId === draggableId ? { ...task, status: destination.droppableId } : task));

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
            <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
                <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3 className="font-semibold">Edit Task</h3>
                    <IconButton onClick={closeDrawer} aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider />
                <Box sx={{ p: 2, display: "grid", gap: 2 }}>
                    <TextField label="Task Name" value={form.taskName} onChange={(e) => setForm((f) => ({ ...f, taskName: e.target.value }))} size="small" fullWidth required inputRef={nameRef} />
                    <TextField label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} size="small" fullWidth multiline minRows={3} />
                    <TextField label="Assigned To" value={users.some(u => u.email === form.assignedTo) ? form.assignedTo : ""} onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))} size="small" select fullWidth>
                        <MenuItem value="">
                            <em>Select assignee</em>
                        </MenuItem>
                        {users.map(u => (
                            <MenuItem key={u.userId} value={u.email}>
                                {u.name} ({u.email})
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <Button variant="outlined" fullWidth onClick={closeDrawer}>Cancel</Button>
                        <Button variant="contained" fullWidth onClick={() => handleEditTasks()}>Save</Button>
                    </Box>
                </Box>
            </Drawer>
            <h1 className="my-1 font-bold text-center">Manage Kanban Board</h1>
            <div className="flex gap-6 p-3">
                {columns.map(col => (
                    <Droppable droppableId={col.id} key={col.id}>
                        {provided => (
                            <div className="w-1/3 bg-gray-100 p-4 rounded" ref={provided.innerRef} {...provided.droppableProps}>
                                <h2 className="font-bold mb-3">{col.title}</h2>
                                {col.items.map((task, index) => (
                                    <Draggable key={task.taskId} draggableId={task.taskId!} index={index}>
                                        {provided => (
                                            <div className="p-3 bg-white rounded shadow mb-2" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <div className="flex justify-end">
                                                    <Button color="inherit" onClick={() => openDrawer(task)}>
                                                        <EditOutlined fontSize="small" />
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-gray-500">Task ID: <span>{task.taskId}</span></p>
                                                <p className="font-semibold">{task.taskName}</p>
                                                <p className="text-sm text-gray-500">{task.taskDescription}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Assigned to: <br />
                                                    <span>{task.assigneeName}</span> <br />
                                                    <span>{task.assigneeEmail}</span>
                                                </p>
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