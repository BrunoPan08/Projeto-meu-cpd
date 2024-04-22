<template>
  <div class="container">
    <h1 class="page-title">Lista de Tarefas</h1>
    <p class="subtitle">A todo app powered by Vue.js</p>
    <div class="filter-container">
      <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Pesquisar por nome da tarefa" class="search-input">
      </div>
      <div class="status-filter">
        <select v-model="statusFilter" class="status-select">
          <option value="">Todos</option>
          <option value="NotStarted">Pendente</option>
          <option value="Completed">Concluída</option>
          <option value="Archived">Arquivada</option>
        </select>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Concluída</th>
            <th scope="col">Tarefa</th>
            <th scope="col">Estado</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr scope="row" v-for="task in filteredTasks" :key="task.id">
            <input type="checkbox" :id="'checkbox_' + task.id" :checked="task.status === 'Completed'" @change="toggleTaskStatus(task)">
            <td v-if="task.id !== editingTaskId">{{ task.title }}</td>
            <td v-else><input type="text" v-model="editedTask.title" class="form-control"></td>
            <td>{{ translateStatus(task.status) }}</td>
            <td>
              <template v-if="task.id !== editingTaskId">
                <button @click="openEditModal(task)" class="btn btn-sm btn-primary">Editar</button>
                <button @click="deleteTask(task)" class="btn btn-sm btn-danger">Excluir</button>
              </template>
              <template v-else>
                <button @click="saveEditedTask" class="btn btn-sm btn-primary">Salvar</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="isEditModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeEditModal" class="close">&times;</span>
        <input type="text" v-model="editedTask.title" placeholder="Título da Tarefa" class="form-control">
        <select v-model="editedTask.status" placeholder="Status da Tarefa" class="form-control">
          <option value="NotStarted">Pendente</option>
          <option value="InProgress">Em Progresso</option>
          <option value="Testing">Em Teste</option>
          <option value="Completed">Concluída</option>
          <option value="Archived">Arquivada</option>
        </select>
        <button @click="saveEditedTask" class="btn btn-primary">Salvar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { generateClient } from 'aws-amplify/api';
import { listTodos } from '../graphql/queries';
import { deleteTodo, updateTodo } from '../graphql/mutations';

export default {
  setup() {
    const tasks = ref([]);
    const searchQuery = ref('');
    const statusFilter = ref('');
    const isEditModalOpen = ref(false);
    const editedTask = ref(null);
    const editingTaskId = ref(null);

    const fetchTasks = async () => {
      try {
        const result = await generateClient().graphql({ query: listTodos });
        tasks.value = result.data.listTodos.items;
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const toggleTaskStatus = async (task) => {
      try {
        const newStatus = task.status === 'Completed' ? 'NotStarted' : 'Completed';
        await generateClient().graphql({
          query: updateTodo,
          variables: { input: { id: task.id, status: newStatus } }
        });
        task.status = newStatus;
      } catch (error) {
        console.error('Error toggling task status:', error);
      }
    };

    const openEditModal = (task) => {
      editingTaskId.value = task.id;
      editedTask.value = { id: task.id, title: task.title, status: task.status };
      isEditModalOpen.value = true;
    };

    const closeEditModal = () => {
      editingTaskId.value = null;
      isEditModalOpen.value = false;
    };

    const saveEditedTask = async () => {
      try {
        const { id, title, status } = editedTask.value;
        await generateClient().graphql({
          query: updateTodo,
          variables: { input: { id, title, status } }
        });
        const index = tasks.value.findIndex(task => task.id === editedTask.value.id);
        if (index !== -1) {
          tasks.value[index].title = title;
          tasks.value[index].status = status;
        }
        closeEditModal();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    };

    const deleteTask = async (task) => {
      try {
        await generateClient().graphql({ query: deleteTodo, variables: { input: { id: task.id } } });
        tasks.value = tasks.value.filter(t => t.id !== task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };

    const translateStatus = (status) => {
      switch (status) {
        case 'NotStarted':
          return 'Pendente';
        case 'InProgress':
          return 'Em Progresso';
        case 'Testing':
          return 'Em Teste';
        case 'Completed':
          return 'Concluída';
        case 'Archived':
          return 'Arquivada';
        default:
          return status;
      }
    };

    const filteredTasks = computed(() => {
      return tasks.value.filter(task => {
        if (!statusFilter.value) {
          return task.title.toLowerCase().includes(searchQuery.value.toLowerCase());
        } else {
          return task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) && task.status === statusFilter.value;
        }
      });
    });

    onMounted(() => {
      fetchTasks();
    });

    return {
      tasks,
      searchQuery,
      statusFilter,
      isEditModalOpen,
      editedTask,
      editingTaskId,
      openEditModal,
      closeEditModal,
      saveEditedTask,
      deleteTask,
      translateStatus,
      filteredTasks,
      toggleTaskStatus 
    };
  }
};
</script>

<style scoped>
.container {
  margin-top: 20px;
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-container {
  flex: 1;
}

.search-input {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
}

.status-filter {
  margin-left: 20px;
}

.status-select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
