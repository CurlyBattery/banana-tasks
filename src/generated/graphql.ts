
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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

export interface UpdateUserInput {
    departmentId?: Nullable<number>;
    email?: Nullable<string>;
    id: number;
    name?: Nullable<string>;
}

export interface Message {
    message: string;
}

export interface IMutation {
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    refresh(): Tokens | Promise<Tokens>;
    removeUser(id: number): Nullable<boolean> | Promise<Nullable<boolean>>;
    signIn(signInInput?: Nullable<SignInInput>): Tokens | Promise<Tokens>;
    signUp(createUserInput: CreateUserInput): User | Promise<User>;
    updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
}

export interface IQuery {
    getUser(id: number): Nullable<User> | Promise<Nullable<User>>;
    getUsers(): Nullable<User>[] | Promise<Nullable<User>[]>;
    logout(): Message | Promise<Message>;
    me(): User | Promise<User>;
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

type Nullable<T> = T | null;
