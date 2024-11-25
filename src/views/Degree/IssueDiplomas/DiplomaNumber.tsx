import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconArrowLeft, IconCheck, IconPlus } from "@tabler/icons-react";
import StudentGraduatedView from "../../Student/StudentGraduated/StudentGraduated";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { modals } from "@mantine/modals";
import SelectOptionSV from "./SelectOptionSV";

const DiplomaNumber = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<any>(null);
  const [year, setYear] = useState<any>(null);

  const modalSelectOption = () => {
    modals.openConfirmModal({
      title: <Title order={5}>Thông tin sinh viên tốt nghiệp</Title>,
      size: "auto",
      children: (
        <SelectOptionSV
          period={period}
          year={year}
          setPeriod={setPeriod}
          setYear={setYear}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  useEffect(() => {
    modalSelectOption();
  }, []);

  return (
    <Box p={"10px 10px 0px 10px"}>
      <Flex justify={"flex-end"} gap={"md"}>
        <Button
          leftSection={<IconArrowLeft size={14} />}
          color="red"
          onClick={() => navigate("/issue-diplomas")}
        >
          Quay lại
        </Button>
        <Button
          leftSection={<IconCheck size={14} />}
          color="teal"
          onClick={() => navigate("/issue-diplomas")}
        >
          Xác nhận
        </Button>
      </Flex>
      <Divider mt={10} label="Thông tin cấp văn bằng" labelPosition="center" />
      <Grid align="center">
        <Grid.Col span={{ base: 12, md: 6, lg: 1.8 }}>
          <TextInput label="Số QĐ TN" placeholder="Nhập số GĐ TN" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 1.8 }}>
          <DatePickerInput
            label="Ngày QĐ TN"
            placeholder="Nhập ngày QĐ TN"
            defaultValue={new Date()}
            valueFormat="DD-MM-YYYY"
          />
          <DatePickerInput
            label="Ngày vào sổ"
            placeholder="Nhập ngày vào sổ"
            defaultValue={new Date()}
            valueFormat="DD-MM-YYYY"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 1.8 }}>
          <TextInput
            label="Số bằng từ"
            placeholder="Nhập số bằng"
            type="number"
          />
          <TextInput
            label="Số vào sổ từ"
            placeholder="Nhập số vào sổ"
            type="number"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 1.8 }}>
          <TextInput
            label="Số ký tự"
            placeholder="Nhập số ký tự"
            type="number"
            defaultValue={4}
          />
          <TextInput
            label="Số ký tự"
            placeholder="Nhập số ký tự"
            type="number"
            defaultValue={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 1.8 }}>
          <TextInput label="Đầu SB" placeholder="Nhập đầu SB" />
          <TextInput label="Đầu SB" placeholder="Nhập đầu SB" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 1.8 }}>
          <TextInput label="Đuôi SB" placeholder="Nhập đuôi SB" />
          <TextInput label="Đuôi SB" placeholder="Nhập đuôi SB" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 1.2 }}>
          <Button leftSection={<IconPlus size={14} />} mt={22} w={"100%"}>
            Lập số bằng
          </Button>
          <Button leftSection={<IconPlus size={14} />} mt={22} w={"100%"}>
            Lập số vào sổ
          </Button>
        </Grid.Col>
      </Grid>
      <Divider
        mt={15}
        mb={10}
        label="Sinh viên tốt nghiệp"
        labelPosition="center"
      />
      <StudentGraduatedView
        isDiplomaNumber={true}
        period={period}
        year={year}
      />
    </Box>
  );
};

export default DiplomaNumber;
