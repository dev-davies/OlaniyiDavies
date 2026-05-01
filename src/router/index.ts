import HomeView from "../views/HomeView.vue";
import ProjectsView from "../views/ProjectsView.vue";

export const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/projects",
    name: "projects",
    component: ProjectsView,
  },
];
