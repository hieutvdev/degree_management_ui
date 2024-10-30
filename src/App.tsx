import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { Box, Flex } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavbarNested } from "./layout/admin/navbar";
import Home from "./views/Home/Home";
import Faculty from "./views/CategoryManagement/Faculty/Faculty";
import Major from "./views/CategoryManagement/Major/Major";
import StudentGraduated from "./views/Student/StudentGraduated/StudentGraduated";
import DegreeType from "./views/Degree/DegreeType/DegreeType";

function App() {
  return (
    <BrowserRouter>
      <Flex w={"100%"}>
        <Box w={"20%"}>
          <NavbarNested />
        </Box>
        <Box w={"80%"} p={10}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faculty/faculty-management" element={<Faculty />} />
            <Route path="/faculty/major-management" element={<Major />} />
            <Route
              path="/student/student-graduated"
              element={<StudentGraduated />}
            />
            <Route path="/degree/degree-type" element={<DegreeType />} />
          </Routes>
        </Box>
      </Flex>
    </BrowserRouter>
  );
}

export default App;
