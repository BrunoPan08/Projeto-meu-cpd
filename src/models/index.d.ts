import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

export enum TaskStatus {
  NOT_STARTED = "NotStarted",
  IN_PROGRESS = "InProgress",
  TESTING = "Testing",
  COMPLETED = "Completed",
  ARCHIVED = "Archived"
}



type EagerTodo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Todo, 'id'>;
  };
  readonly id: string;
  readonly title: string;
  readonly status: TaskStatus | keyof typeof TaskStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyTodo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Todo, 'id'>;
  };
  readonly id: string;
  readonly title: string;
  readonly status: TaskStatus | keyof typeof TaskStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type Todo = LazyLoading extends LazyLoadingDisabled ? EagerTodo : LazyTodo

export declare const Todo: (new (init: ModelInit<Todo>) => Todo) & {
  copyOf(source: Todo, mutator: (draft: MutableModel<Todo>) => MutableModel<Todo> | void): Todo;
}