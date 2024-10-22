import React, { useState } from "react";
import {
  Button,
  Divider,
  Flex,
  SelectField,
  TextField,
} from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "@/amplify/data/resource";

type FormProps = {
  onFormResponse: (response: boolean) => void;
};

const client = generateClient<Schema>();

export const CreateProjectForm = ({ onFormResponse }: FormProps) => {
  const [title, setTitle] = useState("");
  const [completionStatus, setCompletionStatus] = useState("Not Started");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && completionStatus) {
      client.models.Project.create({
        title,
        numberOfTasks: 0,
        completionStatus,
      });
      onFormResponse(true);
      setTitle("");
      setCompletionStatus("");
    }
  };

  return (
    <section className="modal-view">
      <div>
        <h2 className="text-black">Add Form</h2>
        <div className="my-4">
          <Divider size="small" />
        </div>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="1rem">
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
              Add
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
