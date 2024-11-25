import {
  Box,
  Button,
  ComboboxItem,
  Divider,
  Flex,
  Grid,
  NumberInput,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import StudentGraduatedView from "../../Student/StudentGraduated/StudentGraduated";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { modals } from "@mantine/modals";
import SelectOptionSV from "./SelectOptionSV";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { notifications } from "@mantine/notifications";

const DiplomaNumber = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<any>(null);
  const [year, setYear] = useState<any>(null);
  const [studentIds, setStudentIds] = useState([]);
  const [dataSubmit, setDataSubmit] = useState<any>({
    studentIds: [],
    degreeTypeId: null,
    warehouseId: null,
    decisionNumber: null,
    prefixCode: null,
    startCodeNum: null,
    codeLength: null,
    suffixCode: null,
    prefixRegNo: null,
    startRegNoNum: null,
    regNoLength: null,
    suffixRegNo: null,
  });

  console.log(dataSubmit);
  const [dataDegreeTypeSelect, setDataDegreeTypeSelect] = useState<
    ComboboxItem[]
  >([]);
  const [dataWareHouseSelect, setDataWareHouseSelect] = useState<
    ComboboxItem[]
  >([]);

  const handleChangeDataSubmit = (value: any, key: string) => {
    setDataSubmit((prevData: any) => ({ ...prevData, [key]: value }));
  };

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

  const handleIssueIdentificationNum = async () => {
    const url = `${API_ROUTER.ISSUE_IDENTIFICATION}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.post(url, {
      ...dataSubmit,
      studentIds: studentIds,
    });

    if (dataApi && dataApi?.isSuccess) {
      navigate("/issue-diplomas");
      notifications.show({
        color: "green",
        message: "Chạy số hiệu hoàn tất !",
      });
    }
  };

  const getSelectDegreeType = async () => {
    const url = `${API_ROUTER.GET_SELECT_DEGREETYPE}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataDegreeTypeSelect(
        result
          ?.filter((item: any) => item.text != null && item.value != null)
          ?.map((item: any) => ({
            label: item.text,
            value: item.value?.toString(),
          }))
      );
    }
  };

  const getSelectWareHouse = async () => {
    const url = `${API_ROUTER.GET_SELECT_WAREHOUSE}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataWareHouseSelect(
        result
          ?.filter((item: any) => item.text != null && item.value != null)
          ?.map((item: any) => ({
            label: item.text,
            value: item.value?.toString(),
          }))
      );
    }
  };

  useEffect(() => {
    modalSelectOption();
    Promise.all([getSelectDegreeType(), getSelectWareHouse()]);
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
          onClick={() => handleIssueIdentificationNum()}
        >
          Xác nhận
        </Button>
      </Flex>
      <Divider mt={10} label="Thông tin cấp văn bằng" labelPosition="center" />
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
          <TextInput
            label="Số QĐ TN"
            placeholder="Số GĐ TN"
            type="number"
            onChange={(e) =>
              handleChangeDataSubmit(e.currentTarget.value, "decisionNumber")
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
          <Select
            label="Loại văn bằng"
            placeholder="Loại văn bằng"
            data={dataDegreeTypeSelect}
            searchable
            clearable
            nothingFoundMessage="Không tìm thấy loại văn bẳng !"
            onChange={(e) =>
              handleChangeDataSubmit(Number(e) ?? "", "degreeTypeId")
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
          <Select
            label="Kho xuất"
            placeholder="Kho xuất"
            data={dataWareHouseSelect}
            searchable
            clearable
            nothingFoundMessage="Không tìm thấy kho !"
            onChange={(e) =>
              handleChangeDataSubmit(Number(e) ?? "", "warehouseId")
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
          <TextInput
            label="Tiền tố"
            placeholder="Tiền tố"
            onChange={(e) =>
              handleChangeDataSubmit(e.currentTarget.value, "prefixCode")
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
          <NumberInput
            label="Số bắt đầu"
            placeholder="Số bắt đầu"
            hideControls
            min={1}
            onChange={(e) => handleChangeDataSubmit(Number(e), "startCodeNum")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
          <NumberInput
            label="Độ dài số bằng"
            placeholder="Độ dài số bằng"
            hideControls
            min={1}
            onChange={(e) => handleChangeDataSubmit(Number(e), "codeLength")}
          />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
          <TextInput
            label="Hậu tố"
            placeholder="Hậu tố"
            onChange={(e) =>
              handleChangeDataSubmit(e.currentTarget.value, "suffixCode")
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
          <TextInput
            label="Tiền tố số cấp"
            placeholder="Tiền tố số cấp"
            onChange={(e) =>
              handleChangeDataSubmit(e.currentTarget.value, "prefixRegNo")
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
          <NumberInput
            label="Số cấp bắt đầu"
            placeholder="Số cấp bắt đầu"
            hideControls
            min={1}
            onChange={(e) => handleChangeDataSubmit(Number(e), "startRegNoNum")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
          <NumberInput
            label="Độ dài số cấp"
            placeholder="Độ dài số cấp"
            hideControls
            min={1}
            onChange={(e) => handleChangeDataSubmit(Number(e), "regNoLength")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
          <TextInput
            label="Hậu tố số cấp"
            placeholder="Hậu tố số cấp"
            onChange={(e) =>
              handleChangeDataSubmit(e.currentTarget.value, "suffixRegNo")
            }
          />
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
        setStudentIds={setStudentIds}
      />
    </Box>
  );
};

export default DiplomaNumber;
