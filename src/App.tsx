import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import "@mantine/notifications/styles.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/Home/Home";
import Faculty from "./views/CategoryManagement/Faculty/Faculty";
import Major from "./views/CategoryManagement/Major/Major";
import StudentGraduated from "./views/Student/StudentGraduated/StudentGraduated";
import DegreeType from "./views/Degree/DegreeType/DegreeType";
import { Box, Flex } from "@mantine/core";
import NavbarNested from "./layout/admin/navbar";
import DegreeManagement from "./views/Degree/DegreeManagement/DegreeManagement";
import WareHouse from "./views/WareHouse/WareHouse/WareHouse";

function App() {
  return (
    <BrowserRouter>
      <Flex w={"100%"}>
        <Box w={"17.5%"}>
          <NavbarNested />
        </Box>
        <Box w={"82.5%"} p={10}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/major" element={<Major />} />
            <Route path="/student-graduated" element={<StudentGraduated />} />
            <Route path="/degree-type" element={<DegreeType />} />
            <Route path="/degree-management" element={<DegreeManagement />} />
            <Route path="/warehouse" element={<WareHouse />} />
          </Routes>
        </Box>
      </Flex>
    </BrowserRouter>
  );
}

export default App;
