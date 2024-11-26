import React, { useState } from "react";
import { AgCharts } from "ag-charts-react";
import { Box, Button, Flex, Grid, Input, Select, Text } from "@mantine/core";
import { AgChartOptions } from "ag-charts-community";
import { getData } from "./data";
const Home = () => {
  const [options, setOptions] = useState<AgChartOptions>({
    title: {
      text: "Race demographics",
    },
    subtitle: {
      text: "Number of participants by age",
    },
    data: getData(),
    series: [
      {
        type: "histogram",
        xKey: "age",
        xName: "Participant Age",
        binCount: 20,
      },
    ],
    axes: [
      {
        type: "number",
        position: "bottom",
        title: { text: "Age (years)" },
      },
      {
        type: "number",
        position: "left",
        title: { text: "Number of participants" },
      },
    ],
  });

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

  const [pieData, setPieData] = useState<AgChartOptions>({
    title: { text: "Tỷ lệ loại bằng" },
    data: [
      { asset: "Cử nhân", amount: 30 },
      { asset: "Kỹ sư", amount: 40 },
      { asset: "Dược sỹ", amount: 20 },
      { asset: "Kiến trúc sư", amount: 40 },
    ],
    series: [
      {
        type: "pie",
        angleKey: "amount",
        legendItemKey: "asset",
      },
    ],
  });

  const [byP, setByP] = useState<AgChartOptions>({
    title: { text: "Tỷ lệ học lực" },
    data: [
      { asset: "Trung bình", amount: 6000 },
      { asset: "Khá", amount: 7000 },
      { asset: "Giỏi", amount: 4000 },
      { asset: "Suất xắc", amount: 2000 },
    ],
    series: [
      {
        type: "pie",
        angleKey: "amount",
        legendItemKey: "asset",
      },
    ],
  });

  const [byY, setByY] = useState<AgChartOptions>({
    title: { text: "Tỷ lệ học lực" },
    data: [
      { asset: "Trung bình", amount: 6000 },
      { asset: "Khá", amount: 7000 },
      { asset: "Giỏi", amount: 4000 },
      { asset: "Suất xắc", amount: 2000 },
    ],
    series: [
      {
        type: "pie",
        angleKey: "amount",
        legendItemKey: "asset",
      },
    ],
  });

  return (
    <>
      <Grid>
        <Grid.Col p={20}>
          <Flex justify={"space-between"} align={"center"}>
            <Text>Báo cáo thông kê hệ thống quản lý văn bằng</Text>
            <Flex gap={"20px"}>
              <Select
                data={[
                  { label: "2021", value: "2021" },
                  { label: "2022", value: "2022" },
                  { label: "2023", value: "2023" },
                ]}
                placeholder="Select year"
                w={200}
              />
              <Input placeholder="Search" />
              <Button variant="outline" color="blue">
                Filter
              </Button>
              <Button variant="outline" color="indigo">
                Export
              </Button>
            </Flex>
          </Flex>
          <hr />
        </Grid.Col>

        <Grid.Col span={4}>
          <AgCharts options={pieData} />
        </Grid.Col>
        <Grid.Col span={4}>
          <AgCharts options={byP} />
        </Grid.Col>
        <Grid.Col span={4}>
          <AgCharts options={pieData} />
        </Grid.Col>
        <Grid.Col>
          <AgCharts options={options as any} />
        </Grid.Col>
        <Grid.Col>
          <p>Số lượng sinh viên tốt nghiệp theo khoa</p>
          <AgCharts options={departmentOptions} />
        </Grid.Col>
        <Grid.Col>
          <p>Số lượng sinh viên tốt nghiệp theo năm</p>
          <AgCharts options={yearOptions} />
        </Grid.Col>

        <Grid.Col>
          <p>Tỷ lệ chất lượng đầu ra</p>
          <AgCharts options={semesterOptions} />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Home;
