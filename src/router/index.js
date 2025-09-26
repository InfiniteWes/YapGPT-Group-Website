import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import OurProject from '../views/OurProject.vue';
import TeamPage from '../views/TeamPage.vue';
import WorkTracker from '../views/WorkTracker.vue';
import Deliverables from '../views/Deliverables.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/OurProject', component: OurProject },
    { path: '/TeamPage', component: TeamPage },
    { path: '/WorkTracker', component: WorkTracker },
    { path: '/Deliverables', component: Deliverables },
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})