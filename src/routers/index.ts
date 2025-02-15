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
import Period from "../views/CategoryManagement/Period/Period";
import Specialization from "../views/CategoryManagement/Specialization/Specialization";
import Inward from "../views/WareHouse/InWard/Inward";
import Role from "../views/Administrator/Role/Role";
import User from "../views/Administrator/User/User";
import IssueDiplomas from "../views/Degree/IssueDiplomas/IssueDiplomas";
import DiplomaNumber from "../views/Degree/IssueDiplomas/DiplomaNumber";
import ProposalForm from "../views/WareHouse/ProposalForm/ProposalForm";
import EmbryoIssuance from "../views/WareHouse/EmbryoIssuance/EmbryoIssuance";
import EmbryoExport from "../views/WareHouse/EmbryoExport/EmbryoExport";

const routerConfig = [
  { path: "/", component: Home, layout: AdminLayout },
  { path: "/faculty", component: Faculty, layout: AdminLayout },
  { path: "/major", component: Major, layout: AdminLayout },
  { path: "/specialization", component: Specialization, layout: AdminLayout },
  { path: "/period", component: Period, layout: AdminLayout },
  { path: "/year-graduation", component: YearGraduation, layout: AdminLayout },
  { path: "/degree-type", component: DegreeType, layout: AdminLayout },
  { path: "/issue-diplomas", component: IssueDiplomas, layout: AdminLayout },
  { path: "/diploma-number", component: DiplomaNumber, layout: DefaulLayout },
  { path: "/proposal-form", component: ProposalForm, layout: AdminLayout },
  { path: "/embryo-issuance", component: EmbryoIssuance, layout: AdminLayout },
  { path: "/embryo-export", component: EmbryoExport, layout: AdminLayout },
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
  { path: "/inward", component: Inward, layout: AdminLayout },
  { path: "/inventory", component: Inventory, layout: AdminLayout },
  { path: "/role", component: Role, layout: AdminLayout },
  { path: "/users", component: User, layout: AdminLayout },
  { path: "/register", component: Register, layout: DefaulLayout },
  { path: "/login", component: Login, layout: DefaulLayout },
];

export { routerConfig };
