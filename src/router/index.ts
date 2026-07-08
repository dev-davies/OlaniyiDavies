import HomeView from "../views/HomeView.vue";
import ProjectsView from "../views/ProjectsView.vue";
import BlogHubView from "../views/BlogHubView.vue";
import BlogPostView from "../views/BlogPostView.vue";

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
  {
    path: "/blog",
    name: "blog",
    component: BlogHubView,
  },
  {
    path: "/blog/:slug",
    name: "blog-post",
    component: BlogPostView,
    props: true,
  },
];
