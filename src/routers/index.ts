import path from "path";
import { DefaulLayout } from "../App";
import AdminLayout from "../layout/admin";
import Register from "../views/Auth/Register";

import Faculty from "../views/CategoryManagement/Faculty/Faculty";
import Major from "../views/CategoryManagement/Major/Major";
import Home from "../views/Home/Home";
import Login from "../views/Auth/Login";
import WareHouse from "../views/WareHouse/WareHouse/WareHouse";
import StudentGraduatedView from "../views/Student/StudentGraduated/StudentGraduated";
import DegreeManagement from "../views/Degree/DegreeManagement/DegreeManagement";
import Inventory from "../views/WareHouse/Inventory/Inventory";
import DegreeType from "../views/Degree/DegreeType/DegreeType";
import YearGraduation from "../views/CategoryManagement/YearGraduation/YearGraduation";

const routerConfig = [
  { path: "/", component: Home, layout: AdminLayout },
  { path: "/faculty", component: Faculty, layout: AdminLayout },
  { path: "/major", component: Major, layout: AdminLayout },
  { path: "/year-graduation", component: YearGraduation, layout: AdminLayout },
  { path: "/degree-type", component: DegreeType, layout: AdminLayout },
  {
    path: "/student-graduated",
    component: StudentGraduatedView,
    layout: AdminLayout,
  },
  {
    path: "/degree-management",
    component: DegreeManagement,
    layout: AdminLayout,
  },
  { path: "/warehouse", component: WareHouse, layout: AdminLayout },
  { path: "/inventory", component: Inventory, layout: AdminLayout },
  { path: "/register", component: Register, layout: DefaulLayout },
  { path: "/login", component: Login, layout: DefaulLayout },
];

export { routerConfig };
