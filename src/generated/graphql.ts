/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum TaskStatus {
  DONE = 'DONE',
  IN_PROGRESS = 'IN_PROGRESS',
  NEW = 'NEW',
  OVERDUE = 'OVERDUE',
}

export interface CreateTaskInput {
  assignedToId?: Nullable<number>;
  createdById?: Nullable<number>;
  deadline: DateTime;
  description: string;
  priority?: Nullable<number>;
  status: TaskStatus;
  title: string;
}

export interface CreateUserInput {
  departmentId?: Nullable<number>;
  email: string;
  fullName: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface UpdateTaskInput {
  deadline: DateTime;
  description: string;
  priority: number;
  title: string;
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}

export interface UpdateUserInput {
  departmentId?: Nullable<number>;
  email?: Nullable<string>;
  id: number;
  name?: Nullable<string>;
}

export interface Department {
  description?: Nullable<string>;
  id?: Nullable<number>;
  name: string;
}

export interface IMutation {
  createTask(createTaskInput: CreateTaskInput): Task | Promise<Task>;
  createUser(createUserInput: CreateUserInput): User | Promise<User>;
  refresh(): Tokens | Promise<Tokens>;
  removeTask(id: number): Nullable<boolean> | Promise<Nullable<boolean>>;
  removeUser(id: number): Nullable<boolean> | Promise<Nullable<boolean>>;
  signIn(signInInput?: Nullable<SignInInput>): Tokens | Promise<Tokens>;
  signUp(createUserInput: CreateUserInput): User | Promise<User>;
  updateTask(updateTaskInput: UpdateTaskInput): Task | Promise<Task>;
  updateTaskStatus(
    updateTaskStatusInput: UpdateTaskStatusInput,
  ): Task | Promise<Task>;
  updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
}

export interface IQuery {
  getDepartments():
    | Nullable<Nullable<Department>[]>
    | Promise<Nullable<Nullable<Department>[]>>;
  getTask(id: number): Nullable<Task> | Promise<Nullable<Task>>;
  getTasks(): Nullable<Task>[] | Promise<Nullable<Task>[]>;
  getUser(id: number): Nullable<User> | Promise<Nullable<User>>;
  getUsers(): Nullable<User>[] | Promise<Nullable<User>[]>;
  logout(): Success | Promise<Success>;
  me(): User | Promise<User>;
}

export interface Success {
  success: boolean;
}

export interface Task {
  assignedToId?: Nullable<number>;
  createdById?: Nullable<number>;
  deadline: DateTime;
  description?: Nullable<string>;
  id?: Nullable<number>;
  priority?: Nullable<number>;
  status: TaskStatus;
  title: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  departmentId?: Nullable<number>;
  email: string;
  fullName?: Nullable<string>;
  id?: Nullable<number>;
  isActive?: Nullable<boolean>;
}

export type DateTime = any;
type Nullable<T> = T | null;
