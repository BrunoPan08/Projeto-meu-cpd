// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const TaskStatus = {
  "NOT_STARTED": "NotStarted",
  "IN_PROGRESS": "InProgress",
  "TESTING": "Testing",
  "COMPLETED": "Completed",
  "ARCHIVED": "Archived"
};

const { Todo } = initSchema(schema);

export {
  Todo,
  TaskStatus
};