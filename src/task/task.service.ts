import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TaskService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((item) => item.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (item) =>
          item.title.includes(search) || item.description.includes(search),
      );
    }
    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((item) => item.id === id);

    if (!found) {
      throw new NotFoundException('Task with specified id is not found.');
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    this.getTaskById(id); //Added to invoke not found error if deleting nonexisting task.
    this.tasks = this.tasks.filter((item) => item.id !== id);
  }

  updateTask(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
