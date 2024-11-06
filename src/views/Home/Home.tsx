import React, { useState } from "react";
import { AgCharts } from "ag-charts-react";
import { Box, Flex, Grid } from "@mantine/core";

const Home = () => {
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

  const [pieData, setPieData] = useState<any>({
    title: { text: "Asset Allocation" },
    data: [
      { asset: "Stocks", amount: 60000 },
      { asset: "Bonds", amount: 40000 },
      { asset: "Cash", amount: 7000 },
      { asset: "Real Estate", amount: 5000 },
      { asset: "Commodities", amount: 3000 },
    ],
    series: [{ type: "pie", angleKey: "amount", labelKey: "asset" }],
  });

  return (
    <>
      <Grid>
        <Grid.Col span={4}>
          <AgCharts options={pieData} />
        </Grid.Col>
        <Grid.Col span={4}>
          <AgCharts options={pieData} />
        </Grid.Col>
        <Grid.Col span={4}>
          <AgCharts options={pieData} />
        </Grid.Col>
        <Grid.Col>
          <p>Graduation Rate by Department</p>
          <AgCharts options={departmentOptions} />
        </Grid.Col>
        <Grid.Col>
          <p>Graduation Rate by Year</p>
          <AgCharts options={yearOptions} />
        </Grid.Col>

        <Grid.Col>
          <p>Graduation Rate by Semester</p>
          <AgCharts options={semesterOptions} />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Home;
