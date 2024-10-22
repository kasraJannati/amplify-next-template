import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  TextField,
  SelectField,
  Divider,
} from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "@/amplify/data/resource";

type Project = {
  id: string;
  title: string;
  completionStatus: string;
};

type EditFormProps = {
  project: Project;
  onFormResponse: (response: boolean) => void;
};

const client = generateClient<Schema>();

export const EditProjectForm = ({ project, onFormResponse }: EditFormProps) => {
  const [title, setTitle] = useState("");
  const [completionStatus, setCompletionStatus] = useState("Not Started");

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setCompletionStatus(project.completionStatus);
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && completionStatus) {
      client.models.Project.update({
        id: project.id,
        title,
        completionStatus,
      });
      onFormResponse(true);
      setTitle("");
      setCompletionStatus("Not Started");
    }
  };

  return (
    <section className="modal-view">
      <div>
        <h2 className="text-black">Edit Project</h2>
        <div className="my-4">
          <Divider size="small" />
        </div>
        <form onSubmit={handleSubmit}>
          <Flex direction="column">
            <TextField
              label="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <SelectField
              label="Completion Status"
              value={completionStatus}
              onChange={(e) => setCompletionStatus(e.target.value)}
              required
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </SelectField>
            <Button type="submit" variation="primary">
              Update
            </Button>
            <Button type="button" onClick={() => onFormResponse(false)}>
              Cancel
            </Button>
          </Flex>
        </form>
      </div>
    </section>
  );
};
