<template>
  <div class="task-modal-container">
    <div >
      <h2>{{ isNewTask ? 'Adicionar Tarefa' : 'Editar Tarefa' }}</h2>
      <div class="form-group">
        <label for="taskTitle">Título da Tarefa</label>
        <input type="text" id="taskTitle" v-model="task.title" class="form-control">
      </div>
      <div class="form-group">
        <label for="taskStatus">Status da Tarefa</label>
        <select id="taskStatus" v-model="task.status" class="form-control">
          <option value="NotStarted">Não Iniciada</option>
          <option value="InProgress">Em Progresso</option>
          <option value="Testing">Testando</option>
          <option value="Completed">Concluída</option>
        </select>
      </div>
      <button v-if="isNewTask" @click="createTask" class="btn btn-primary">Adicionar Tarefa</button>
      <button v-else @click="updateTask" class="btn btn-primary">Atualizar Tarefa</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { generateClient } from 'aws-amplify/api';
import { createTodo, updateTodo } from '../graphql/mutations';

export default {
  props: {
    task: {
      type: Object,
      default: () => ({ title: '', status: '' })
    },
    isNewTask: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const client = generateClient();

    const createTask = async () => {
      try {
        const newTaskInput = {
          title: props.task.title,
          status: props.task.status || 'Pending'
        };

        await client.graphql({
          query: createTodo,
          variables: { input: newTaskInput }
        });

        props.task = { title: '', status: '' };
        window.location.reload();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    };

    const updateTask = async () => {
      try {
        await client.graphql({
          query: updateTodo,
          variables: { input: props.task }
        });
      } catch (error) {
        console.error('Error updating task:', error);
      }
    };

    return {
      createTask,
      updateTask,
    };
  }
};
</script>

<style scoped>
.task-modal-container {
  max-width: 1300px;
  padding-right: calc(var(--bs-gutter-x) * .5);
  padding-left: calc(var(--bs-gutter-x) * .5);
  margin-right: auto;
  margin-left: auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
