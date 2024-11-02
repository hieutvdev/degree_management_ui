import path from "path";
import { DefaulLayout } from "../App";
import AdminLayout from "../layout/admin";
import Register from "../views/Auth/Register";

import Faculty from "../views/CategoryManagement/Faculty/Faculty";
import Major from "../views/CategoryManagement/Major/Major";
import Home from "../views/Home/Home";
import Login from "../views/Auth/Login";

const routerConfig = [
  { path: "/", component: Home, layout: AdminLayout },
  { path: "/faculty", component: Faculty, layout: AdminLayout },
  { path: "/major", component: Major, layout: AdminLayout },
  { path: "/student-graduated", component: Home, layout: AdminLayout },
  { path: "/degree-type", component: Faculty, layout: AdminLayout },
  { path: "/student-graduated", component: Home, layout: AdminLayout },
  { path: "/register", component: Register, layout: DefaulLayout },
  { path: "/login", component: Login, layout: DefaulLayout },
];

export { routerConfig };
