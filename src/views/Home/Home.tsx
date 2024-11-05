import React, { useState } from "react";
import { AgCharts } from "ag-charts-react";
import { Box, Flex } from "@mantine/core";

const Home = () => {
  // Options for the graduation rate by department
  const [departmentOptions, setDepartmentOptions] = useState<any>({
    data: [
      { department: "Engineering", gradRate: 85 },
      { department: "Business", gradRate: 78 },
      { department: "Arts", gradRate: 65 },
      { department: "Science", gradRate: 70 },
      { department: "Law", gradRate: 90 },
    ],
    series: [{ type: "bar", xKey: "department", yKey: "gradRate" }],
  });

  // Options for the graduation rate by year
  const [yearOptions, setYearOptions] = useState<any>({
    data: [
      { year: 2018, gradRate: 75 },
      { year: 2019, gradRate: 80 },
      { year: 2020, gradRate: 78 },
      { year: 2021, gradRate: 82 },
      { year: 2022, gradRate: 85 },
    ],
    series: [{ type: "line", xKey: "year", yKey: "gradRate" }],
  });

  // Options for the graduation rate by semester (đợt)
  const [semesterOptions, setSemesterOptions] = useState<any>({
    data: [
      { semester: "Spring 2021", gradRate: 72 },
      { semester: "Fall 2021", gradRate: 75 },
      { semester: "Spring 2022", gradRate: 78 },
      { semester: "Fall 2022", gradRate: 80 },
      { semester: "Spring 2023", gradRate: 83 },
      { semester: "Fall 2023", gradRate: 86 },
    ],
    series: [{ type: "line", xKey: "semester", yKey: "gradRate" }],
  });

  return (
    <div>
      <Flex w={"100%"} gap={30}>
        <Box w={"50%"}>
          <h2>Graduation Rate by Department</h2>
          <AgCharts options={departmentOptions} />
        </Box>
        <Box w={"50%"}>
          <h2>Graduation Rate by Year</h2>
          <AgCharts options={yearOptions} />
        </Box>
      </Flex>

      <h2>Graduation Rate by Semester</h2>
      <AgCharts options={semesterOptions} />
    </div>
  );
};

export default Home;
