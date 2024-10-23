"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Loader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@aws-amplify/ui-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { AlertComponent } from "../components/alert";
import { PopupComponent } from "../components/popup";
import { CreateTaskForm } from "../components/createTaskForm";
import { EditTaskForm } from "../components/editTaskForm";

Amplify.configure(outputs);
const client = generateClient<Schema>();

const TasksPage = () => {
  const searchParams = useSearchParams();
  const projectID = searchParams.get("projectID");
  const [tasks, setTasks] = useState<Array<Schema["Task"]["type"]>>([]);
  const [filteredTasks, setFilteredTasks] = useState<
    Array<Schema["Task"]["type"]>
  >([]);
  const [_createTaskVisible, setCreateTaskVisible] = useState<boolean>(false);
  const [editTaskRecord, setEditTaskRecord] = useState<any>(null);
  const [_editTask, setEditTask] = useState<boolean>(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [_showPopup, setShowPopup] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [alertMessage, setAlertMessage] = useState<{
    text: string;
    variation: "info" | "error" | "warning" | "success";
  } | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (projectID) {
      listTasks();
    }
  }, [projectID]);

  // Filter tasks
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = tasks.filter((task) =>
      task.status ? task.status.toLowerCase().includes(query) : false
    );
    setFilteredTasks(filtered);
  };

  // Sorting tasks by due date
  const sortTasksByDueDate = () => {
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFilteredTasks(sortedTasks);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle the sort order
  };

  // Get tasks
  const listTasks = () => {
    if (projectID) {
      client.models.Task.observeQuery({
        filter: { projectID: { eq: projectID } },
      }).subscribe({
        next: (data) => {
          setTasks([...data.items]);
          setFilteredTasks([...data.items]);
          setLoading(false);
        },
      });
    }
  };

  // Create task
  const createTask = () => setCreateTaskVisible(true); // Show the add form
  const handleAddFormResponse = (response: boolean) => {
    if (response) {
      setAlertMessage({
        text: "Task added successfully!",
        variation: "success",
      });
    }
    setCreateTaskVisible(false);
  };

  // Edit task
  const editTask = (task: Schema["Task"]["type"]) => {
    setEditTaskRecord(task);
    setEditTask(true); // Show the edit form
  };
  const handleEditFormResponse = (response: boolean) => {
    if (response) {
      setAlertMessage({
        text: "Task updated successfully!",
        variation: "success",
      });
    }
    setEditTask(false);
  };

  // Delete task
  const deleteTask = (id: string) => {
    setDeleteTaskId(id);
    setShowPopup(true); // Show the confirmation popup
  };
  const handlePopupResponse = (response: boolean) => {
    setShowPopup(false);
    if (response && deleteTaskId) {
      client.models.Task.delete({ id: deleteTaskId });
      setAlertMessage({
        text: "Task deleted successfully!",
        variation: "success",
      });
      setDeleteTaskId(null);
    }
  };

  const clearAlert = () => {
    setAlertMessage(null);
  };

  return (
    <>
      <h2 className="mb-6 flex">
        <span className="text-white mr-2">
          <Link href="/">Projects</Link>
        </span>
        <span>/ Tasks</span>
      </h2>
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader size="large" variation="linear" />
        </div>
      ) : (
        <section className="bg-white p-2 rounded overflow-x-auto scroll-container">
          <div className="flex items-center justify-between mb-6 bg-white py-4 head-table">
            <div className="w-full pr-2">
              <TextField
                label=""
                labelHidden
                placeholder="Search tasks by status"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="text-nowrap">
              <Button onClick={createTask} variation="primary">
                Add
              </Button>
            </div>
          </div>
          <Table caption="" highlightOnHover={false} variation="striped">
            <TableHead>
              <TableRow>
                <TableCell as="th">Title</TableCell>
                <TableCell as="th">Description</TableCell>
                <TableCell as="th">
                  <div className="flex items-center">
                    <span className="mr-2 text-nowrap">Due Date</span>
                    <Button
                      onClick={sortTasksByDueDate}
                      variation="link"
                      size="small"
                    >
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </Button>
                  </div>
                </TableCell>
                <TableCell as="th">Priority</TableCell>
                <TableCell as="th">Status</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell className="actionCell">
                      <span className="mr-2">
                        <Button
                          onClick={() => editTask(task)}
                          variation="primary"
                          size="small"
                        >
                          Edit
                        </Button>
                      </span>
                      <span>
                        <Button
                          onClick={() => deleteTask(task.id)}
                          variation="primary"
                          colorTheme="error"
                          size="small"
                        >
                          Delete
                        </Button>
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>No tasks found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      )}
      {alertMessage && (
        <AlertComponent
          key={Date.now()} // unique key to force re-render
          text={alertMessage.text}
          variation={alertMessage.variation}
          autoDismiss={true}
          clearAlert={clearAlert}
        />
      )}
      {_showPopup && (
        <PopupComponent
          text="Are you sure to delete this task?"
          textBtnTrue="Delete"
          textBtnFalse="Cancel"
          colorThemeBtnTrue="error"
          onPopupResponse={handlePopupResponse}
        />
      )}
      {_createTaskVisible && (
        <CreateTaskForm
          onFormResponse={handleAddFormResponse}
          projectId={projectID ?? ""}
        />
      )}
      {_editTask && (
        <EditTaskForm
          task={editTaskRecord}
          onFormResponse={handleEditFormResponse}
        />
      )}
    </>
  );
};

export default TasksPage;
