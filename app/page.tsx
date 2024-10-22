"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { AlertComponent } from "./components/alert";
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
import { PopupComponent } from "./components/popup";
import { CreateProjectForm } from "./components/createProjectForm";
import { EditProjectForm } from "./components/editProjectForm";
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function App() {
  const [projects, setProjects] = useState<Array<Schema["Project"]["type"]>>(
    []
  );
  const [filteredProjects, setFilteredProjects] = useState<
    Array<Schema["Project"]["type"]>
  >([]);
  const [_createProject, setCreateProject] = useState<boolean>(false);
  const [editProjectRecord, setEditProjectRecord] = useState<any>(null);
  const [_editProject, setEditProject] = useState<boolean>(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [_showPopup, setShowPopup] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [alertMessage, setAlertMessage] = useState<{
    text: string;
    variation: "info" | "error" | "warning" | "success";
  } | null>(null);

  useEffect(() => {
    listProjects();
  }, []);

  // Filter projects
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = projects.filter(
      (project) =>
        (project.title ? project.title.toLowerCase().includes(query) : false) ||
        (project.completionStatus
          ? project.completionStatus.toLowerCase().includes(query)
          : false)
    );
    setFilteredProjects(filtered);
  }

  // Get projects
  const listProjects = () => {
    client.models.Project.observeQuery().subscribe({
      next: (data) => {
        setProjects([...data.items]);
        setFilteredProjects([...data.items]);
        setLoading(false);
      },
    });
  };

  // Create project
  const createProject = () => setCreateProject(true); // Show the add form
  const handleAddFormResponse = (response: boolean) => {
    if (response) {
      setAlertMessage({
        text: "Project added successfully!",
        variation: "success",
      });
    }
    setCreateProject(false);
  };

  // Edit project
  const editProject = (project: Schema["Project"]["type"]) => {
    setEditProjectRecord(project);
    setEditProject(true); // Show the edit form
  };
  const handleEditFormResponse = (response: boolean) => {
    if (response) {
      setAlertMessage({
        text: "Project updated successfully!",
        variation: "success",
      });
    }
    setEditProject(false);
  };

  // Delete project
  const deleteProject = (id: string) => {
    setDeleteProjectId(id);
    setShowPopup(true); // Show the confirmation popup
  };
  const handlePopupResponse = (response: boolean) => {
    setShowPopup(false);
    if (response && deleteProjectId) {
      client.models.Project.delete({ id: deleteProjectId });
      setAlertMessage({
        text: "Project deleted successfully!",
        variation: "success",
      });
      setDeleteProjectId(null);
    }
  };

  return (
    <>
      <h2 className="mb-6">Projects</h2>
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader size="large" variation="linear" />
        </div>
      ) : (
        <section className="bg-white p-2 rounded overflow-x-auto">
          <div className="flex items-center justify-between mb-6 bg-white p-4 head-table">
            <div className="w-full pr-2">
              <TextField
                label=""
                labelHidden
                placeholder="Search projects by title or completion status"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <Button onClick={createProject} variation="primary">
                Add
              </Button>
            </div>
          </div>
          <Table caption="" highlightOnHover={false} variation="striped">
            <TableHead>
              <TableRow>
                <TableCell as="th">Title</TableCell>
                <TableCell as="th">Number of tasks</TableCell>
                <TableCell as="th">Completion status</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.title}</TableCell>
                    <TableCell>{project.numberOfTasks}</TableCell>
                    <TableCell>{project.completionStatus}</TableCell>
                    <TableCell>
                      <span className="mr-2">
                        <Button
                          onClick={() => editProject(project)}
                          variation="primary"
                        >
                          Edit
                        </Button>
                      </span>
                      <span>
                        <Button
                          onClick={() => deleteProject(project.id)}
                          variation="primary"
                          colorTheme="error"
                        >
                          Delete
                        </Button>
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No projects found.</TableCell>
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
        />
      )}
      {_showPopup && (
        <PopupComponent
          text="Are you sure to delete this?"
          textBtnTrue="Delete"
          textBtnFalse="Cancel"
          colorThemeBtnTrue="error"
          onPopupResponse={handlePopupResponse}
        />
      )}
      {_createProject && (
        <CreateProjectForm onFormResponse={handleAddFormResponse} />
      )}
      {_editProject && (
        <EditProjectForm
          project={editProjectRecord}
          onFormResponse={handleEditFormResponse}
        />
      )}
    </>
  );
}
