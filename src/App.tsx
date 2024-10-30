import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/Home/Home";
import Faculty from "./views/CategoryManagement/Faculty/Faculty";
import Major from "./views/CategoryManagement/Major/Major";
// import StudentGraduated from "./views/Student/StudentGraduated/StudentGraduated";
// import DegreeType from "./views/Degree/DegreeType/DegreeType";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/faculty/major-management" element={<Major />} />
        {/* <Route
          path="/student/student-graduated"
          element={<StudentGraduated />}
        />
        <Route path="/degree/degree-type" element={<DegreeType />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
