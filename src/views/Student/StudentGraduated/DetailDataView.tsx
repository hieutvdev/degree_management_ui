import {
  Box,
  Button,
  ComboboxItem,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import { DateInput, YearPickerInput } from "@mantine/dates";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { SelectResponseBase } from "../../../interfaces/SelectBase";
import { StudentGraduated } from "../../../interfaces/StudentGraduated";
import { DegreeRepository } from "../../../services/RepositoryBase";

const DetailDataView = ({ id }: DetailDataViewProps) => {
  const entity = {
    id: 0,
    fullName: null,
    dateOfBirth: null,
    gender: null,
    graduationYear: null,
    majorId: 0,
    gpa: null,
    honors: null,
    contactEmail: null,
    phoneNumber: null,
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [dataMajors, setDataMajors] = useState<ComboboxItem[]>([]);

  const form = useForm<StudentGraduated>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },
  });

  const getHonorsByGPA = (gpa: number) => {
    if (gpa >= 3.6 && gpa <= 4.0) {
      return { value: 5, type: "Xuất sắc" };
    }
    if (gpa >= 3.2 && gpa < 3.6) {
      return { value: 4, type: "Giỏi" };
    }
    if (gpa >= 2.5 && gpa < 3.2) {
      return { value: 3, type: "Khá" };
    }
    if (gpa >= 2.0 && gpa < 2.5) {
      return { value: 2, type: "Trung bình" };
    }
    if (gpa >= 1.0 && gpa < 2.0) {
      return { value: 1, type: "Yếu" };
    }
    if (gpa < 1.0) {
      return { value: 0, type: "Kém" };
    }
    return { value: -1, type: "GPA không hợp lệ" };
  };

  const getSelectMajor = async () => {
    try {
      const url = `${API_ROUTER.GET_SELECT_MAJOR}`;
      const repo = new DegreeRepository<SelectResponseBase[]>();
      const dataApi = await repo.get(url);
      if (dataApi && dataApi.isSuccess) {
        const result = dataApi.data;
        const mappedData = result?.map((data) => {
          return {
            label: data.text,
            value: data.value.toString(),
          };
        });
        setDataMajors(mappedData ?? []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const callApiGetData = async () => {
    open();
    const url = `${API_ROUTER.GET_DETAIL_STUDENT}?id=${id}`;
    const repo = new DegreeRepository<StudentGraduated>();
    const dataApi = await repo.get(url);

    if (dataApi) {
      const result = dataApi?.data;
      if (result != null) {
        form.setValues(result);
        form.resetDirty(result);
      }
      close();
    } else {
      notifications.show({
        color: "red",
        message: "Dữ liệu không tồn tại !",
      });
      modals.closeAll();
    }
  };

  const parseISODateWithoutTimezone = (dateString: string | null) => {
    if (!dateString) return null;

    // Tách phần ngày và tháng
    const [date, time] = dateString.split("T");
    const [year, month, day] = date.split("-").map(Number);

    // Trả về đối tượng Date mà không cộng thêm giờ
    return new Date(Date.UTC(year, month - 1, day)); // -1 vì tháng trong JS là 0-11
  };

  useEffect(() => {
    if (id) {
      Promise.all([getSelectMajor(), callApiGetData()]);
    }
  }, [id]);

  return (
    <>
      <Box
        component="form"
        mx="auto"
        w={{ base: "250px", md: "300px", lg: "400px" }}
        style={{ position: "relative" }}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Grid mt={10}>
          <Grid.Col>
            <TextInput
              readOnly
              variant="filled"
              label={"Họ và tên"}
              placeholder={"Nhập họ và tên"}
              type="text"
              {...form.getInputProps("fullName")}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <DateInput
              readOnly
              variant="filled"
              locale="vi"
              label={"Ngày sinh"}
              placeholder={"Chọn ngày sinh"}
              valueFormat="DD/MM/YYYY"
              dateParser={(input) => {
                const [day, month, year] = input.split("/").map(Number);
                return new Date(year, month - 1, day);
              }}
              value={
                form.getValues().dateOfBirth
                  ? parseISODateWithoutTimezone(
                      form.getValues().dateOfBirth ?? ""
                    )
                  : undefined
              }
              {...form.getInputProps("dateOfBirth")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              readOnly
              variant="filled"
              label={"Giới tính"}
              placeholder={"Chọn giới tính"}
              data={[
                { value: "0", label: "Nam" },
                { value: "1", label: "Nữ" },
              ]}
              value={
                form.getValues()?.gender !== null
                  ? form.getValues()?.gender
                    ? "1"
                    : "0"
                  : null
              }
              {...form.getInputProps("gender")}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <YearPickerInput
              readOnly
              variant="filled"
              locale="vi"
              label={"Năm tốt nghiệp"}
              placeholder={"Chọn năm tốt nghiệp"}
              clearable
              value={
                form.getValues().graduationYear
                  ? parseISODateWithoutTimezone(
                      form.getValues().graduationYear ?? ""
                    )
                  : undefined
              }
              {...form.getInputProps("graduationYear")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              readOnly
              variant="filled"
              label={"Ngành học"}
              placeholder={"Chọn ngành học"}
              data={dataMajors}
              onClick={() => {
                if (dataMajors?.length === 0) getSelectMajor();
              }}
              value={form.getValues()?.majorId.toString()}
              {...form.getInputProps("majorId")}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              min={0}
              max={4}
              label={"GPA"}
              placeholder={"Nhập GPA hệ 4.0"}
              hideControls
              decimalScale={2}
              allowDecimal
              readOnly
              variant="filled"
              value={Number(form.getValues()?.gpa) ?? 0}
              {...form.getInputProps("gpa")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              readOnly
              variant="filled"
              label={"Xếp loại"}
              type="text"
              value={getHonorsByGPA(form?.getValues()?.gpa ?? 0).type}
            />
          </Grid.Col>
        </Grid>

        <Grid align="center">
          <Grid.Col span={6}>
            <TextInput
              readOnly
              variant="filled"
              label={"Số điện thoại"}
              placeholder={"Nhập số điện thoại"}
              type="text"
              {...form.getInputProps("phoneNumber")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              readOnly
              variant="filled"
              label={"Email"}
              placeholder={"Nhập email"}
              type="text"
              {...form.getInputProps("contactEmail")}
            />
          </Grid.Col>
        </Grid>

        <Group
          justify="end"
          mt="md"
          style={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "white",
          }}
        >
          <Button
            type="button"
            color="gray"
            loading={visible}
            onClick={() => {
              modals.closeAll();
            }}
            leftSection={!visible ? <IconX size={18} /> : undefined}
          >
            Đóng
          </Button>
          <></>
        </Group>
      </Box>
    </>
  );
};

export default DetailDataView;

type DetailDataViewProps = {
  id: string | number;
};
