import { createApp } from 'vue';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from './amplifyconfiguration.json';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';

Amplify.configure(config);

createApp(App).mount('#app');