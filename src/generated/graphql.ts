
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Role {
    ADMINISTRATOR = "ADMINISTRATOR",
    DEVELOPER = "DEVELOPER",
    HEAD_DEPARTMENT = "HEAD_DEPARTMENT",
    MANAGER = "MANAGER",
    SALESMAN = "SALESMAN"
}

export enum TaskStatus {
    DONE = "DONE",
    IN_PROGRES = "IN_PROGRES",
    NEW = "NEW",
    OVERDUE = "OVERDUE"
}

export interface CreateTaskInput {
    assignedToId?: Nullable<number>;
    deadline: DateTime;
    description: string;
    priority?: Nullable<number>;
    title: string;
}

export interface CreateUserInput {
    departmentId?: Nullable<number>;
    email: string;
    fullName: string;
    password: string;
    role?: Nullable<Role>;
}

export interface SignInInput {
    email: string;
    password: string;
}

export interface UpdateTaskInput {
    createdAt: DateTime;
    deadline: DateTime;
    description: string;
    id: number;
    priority: number;
    title: string;
}

export interface UpdateTaskStatusInput {
    id: number;
    status: TaskStatus;
}

export interface UpdateUserInput {
    departmentId?: Nullable<number>;
    email?: Nullable<string>;
    id: number;
    isActive?: Nullable<boolean>;
    name?: Nullable<string>;
}

export interface UserFilterQuery {
    departmentId?: Nullable<number>;
    isActive?: Nullable<boolean>;
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
    removeTask(id: number): Task | Promise<Task>;
    removeUser(id: number): Nullable<boolean> | Promise<Nullable<boolean>>;
    signIn(signInInput?: Nullable<SignInInput>): Tokens | Promise<Tokens>;
    signUp(createUserInput: CreateUserInput): User | Promise<User>;
    updateRead(): Notification | Promise<Notification>;
    updateTask(updateTaskInput: UpdateTaskInput): Task | Promise<Task>;
    updateTaskStatus(updateTaskStatusInput: UpdateTaskStatusInput): Task | Promise<Task>;
    updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
}

export interface Notification {
    createdAt?: Nullable<DateTime>;
    data?: Nullable<string>;
    id?: Nullable<number>;
    isRead?: Nullable<boolean>;
    title?: Nullable<string>;
    userId?: Nullable<number>;
}

export interface IQuery {
    getCreatorTasks(search?: Nullable<string>): Nullable<Task>[] | Promise<Nullable<Task>[]>;
    getDepartments(): Nullable<Nullable<Department>[]> | Promise<Nullable<Nullable<Department>[]>>;
    getMyTasks(search?: Nullable<string>): Nullable<Task>[] | Promise<Nullable<Task>[]>;
    getNotifications(): Nullable<Notification>[] | Promise<Nullable<Notification>[]>;
    getTask(id: number): Nullable<Task> | Promise<Nullable<Task>>;
    getUser(id: number): Nullable<User> | Promise<Nullable<User>>;
    getUsers(query?: Nullable<UserFilterQuery>): Nullable<User>[] | Promise<Nullable<User>[]>;
    logout(): Success | Promise<Success>;
    me(): User | Promise<User>;
}

export interface Success {
    success: boolean;
}

export interface Task {
    assignedToId?: Nullable<number>;
    createdAt?: Nullable<DateTime>;
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
    role?: Nullable<Role>;
}

export type DateTime = any;
type Nullable<T> = T | null;
