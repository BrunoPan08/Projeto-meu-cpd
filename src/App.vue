<template>
  <div>
    <TaskModal />
    <TaskList />
  </div>
</template>

<script>
import TaskList from './components/TaskList.vue';
import TaskModal from './components/TaskModal.vue';

export default {
  components: {
    TaskList,
    TaskModal
  }
}
</script>
<style scoped>
</style>
