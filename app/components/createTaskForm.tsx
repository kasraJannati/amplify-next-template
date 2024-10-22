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
import DatePicker from "react-datepicker";
import { formatDate } from "../helper/dateHelpers";

type FormProps = {
  onFormResponse: (response: boolean) => void;
  projectId: string; // Add projectId to associate tasks with a project
};

const client = generateClient<Schema>();

export const CreateTaskForm = ({ onFormResponse, projectId }: FormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Not Started");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && priority && status) {
      client.models.Task.create({
        title,
        description,
        priority,
        dueDate: formatDate(dueDate),
        status,
        projectID: projectId, // Associate task with the project
      });
      onFormResponse(true);
      setTitle("");
      setDescription("");
      setDueDate(null);
      setPriority("Medium");
      setStatus("Not Started");
    }
  };

  return (
    <section className="modal-view">
      <div>
        <h2 className="text-black">Add Task</h2>
        <div className="my-4">
          <Divider size="small" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 mb-2 mt-2">
            <span className="flex-1">
              <SelectField
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </SelectField>
            </span>
            <span className="flex-1">
              <SelectField
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </SelectField>
            </span>
          </div>

          <div className="datePicker mb-4">
            <span className="label block mb-2">Due Date</span>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              dateFormat="yyyy/MM/dd"
            />
          </div>

          <Flex direction="column" gap="1rem">
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
