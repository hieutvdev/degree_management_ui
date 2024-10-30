import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import "@mantine/notifications/styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/Home/Home";
import Faculty from "./views/CategoryManagement/Faculty/Faculty";
import Major from "./views/CategoryManagement/Major/Major";
import StudentGraduated from "./views/Student/StudentGraduated/StudentGraduated";
import DegreeType from "./views/Degree/DegreeType/DegreeType";
import { Box, Flex } from "@mantine/core";
import NavbarNested from "./layout/admin/navbar";

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
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/major" element={<Major />} />
            <Route path="/student-graduated" element={<StudentGraduated />} />
            <Route path="/degree-type" element={<DegreeType />} />
          </Routes>
        </Box>
      </Flex>
    </BrowserRouter>
  );
}

export default App;
