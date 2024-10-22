import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  TextField,
  SelectField,
  Divider,
} from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import DatePicker from "react-datepicker";
import type { Schema } from "@/amplify/data/resource";
import { convertToFullDate, formatDate } from "../helper/dateHelpers";

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
};

type EditTaskFormProps = {
  task: Task;
  onFormResponse: (response: boolean) => void;
};

const client = generateClient<Schema>();

export const EditTaskForm = ({ task, onFormResponse }: EditTaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Not Started");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(convertToFullDate(task.dueDate));
      setPriority(task.priority);
      setStatus(task.status);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && dueDate && priority && status) {
      client.models.Task.update({
        id: task.id,
        title,
        description,
        dueDate: formatDate(dueDate),
        priority,
        status,
      });
      onFormResponse(true);
      setTitle("");
      setDescription("");
      setDueDate(null);
      setPriority("Low");
      setStatus("Not Started");
    }
  };

  return (
    <section className="modal-view">
      <div>
        <h2 className="text-black">Edit Task</h2>
        <div className="my-4">
          <Divider size="small" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <TextField
              label="Task Title"
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
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
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
              required
            />
          </div>
          <Flex direction="column">
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
