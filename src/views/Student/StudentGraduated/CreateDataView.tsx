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
import { useState } from "react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { SelectResponseBase } from "../../../interfaces/SelectBase";
import { StudentGraduatedModelQuery } from "../../../interfaces/StudentGraduated";
import { DegreeRepository } from "../../../services/RepositoryBase";

const CreateDataView = ({ onClose }: CreateDataViewProps) => {
  const entity = {
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

  const form = useForm<StudentGraduatedModelQuery>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    validate: {
      fullName: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập tên sinh viên!";
        }
        return hasLength(
          { min: 5, max: 50 },
          "Tên phải từ 5-50 kí tự!"
        )(value as string);
      },
      dateOfBirth: (value: string | null) => {
        if (!value) {
          return "Vui lòng chọn ngày sinh!";
        }
      },
      graduationYear: (value: string | null) => {
        if (!value) {
          return "Vui lòng chọn năm tốt nghiệp!";
        }
      },
      gender: (value: boolean | null) => {
        if (value === null || value === undefined) {
          return "Vui lòng chọn giới tính!";
        }
      },
      gpa: (value: number | null) => {
        if (!value) {
          return "Vui lòng nhập điểm gpa hệ 4.0!";
        }
      },
      majorId: (value: number | null) => {
        if (!value) {
          return "Vui lòng chọn ngành học!";
        }
      },

      phoneNumber: (value: string | null) => {
        if (value && !/^\d{8,10}$/.test(value)) {
          return "Số điện thoại phải có từ 8 đến 10 chữ số!";
        }
      },
      contactEmail: (value: string | null) => {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (value && !emailRegex.test(value)) {
          return "Email không hợp lệ!";
        }
        return null;
      },
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
      const url = `${API_ROUTER.GET_SELECT_MAJORS}`;
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

  const handleCreateTblDMInventory = async (
    dataSubmit: StudentGraduatedModelQuery
  ) => {
    open();
    const url = `${API_ROUTER.CREATE_STUDENT}`;
    const repo = new DegreeRepository<StudentGraduatedModelQuery>();
    const dataApi = await repo.post(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Thêm sinh viên thành công !",
      });
      modals.closeAll();
    }
    close();
  };

  return (
    <>
      <Box
        component="form"
        mx="auto"
        w={{ base: "250px", md: "300px", lg: "400px" }}
        onSubmit={form.onSubmit((e: StudentGraduatedModelQuery) => {
          handleCreateTblDMInventory(e);
        })}
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
              label={"Họ và tên"}
              placeholder={"Nhập họ và tên"}
              type="text"
              withAsterisk
              {...form.getInputProps("fullName")}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <DateInput
              locale="vi"
              label={"Ngày sinh"}
              placeholder={"Chọn ngày sinh"}
              withAsterisk
              valueFormat="DD/MM/YYYY"
              dateParser={(input) => {
                const [day, month, year] = input.split("/").map(Number);
                return new Date(year, month - 1, day);
              }}
              value={
                form.getValues().dateOfBirth
                  ? new Date(form.getValues().dateOfBirth ?? "")
                  : undefined
              }
              {...form.getInputProps("dateOfBirth")}
              onChange={(value) => {
                form.setValues((prev) => ({
                  ...prev,
                  dateOfBirth: value?.toISOString(),
                }));
              }}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
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
              onChange={(value) =>
                form.setValues((prev) => ({ ...prev, gender: value === "1" }))
              }
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <YearPickerInput
              label={"Năm tốt nghiệp"}
              placeholder={"Chọn năm tốt nghiệp"}
              withAsterisk
              clearable
              {...form.getInputProps("graduationYear")}
              onChange={(value) =>
                form.setValues((prev) => ({
                  ...prev,
                  graduationYear: value?.toISOString(),
                }))
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label={"Ngành học"}
              placeholder={"Chọn ngành học"}
              data={dataMajors}
              onClick={() => {
                if (dataMajors?.length === 0) getSelectMajor();
              }}
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
              value={Number(form.getValues()?.gpa) ?? 0}
              {...form.getInputProps("gpa")}
              onChange={(value) =>
                form.setValues((prev) => ({
                  ...prev,
                  gpa: Number(value) ?? 0,
                  honors: getHonorsByGPA(Number(value)).value,
                }))
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              readOnly
              label={"Xếp loại"}
              type="text"
              value={getHonorsByGPA(form?.getValues()?.gpa ?? 0).type}
            />
          </Grid.Col>
        </Grid>

        <Grid align="center">
          <Grid.Col span={6}>
            <TextInput
              label={"Số điện thoại"}
              placeholder={"Nhập số điện thoại"}
              type="text"
              {...form.getInputProps("phoneNumber")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
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
          <Button
            type="submit"
            color={"blue"}
            loading={visible}
            leftSection={!visible ? <IconCheck size={18} /> : undefined}
          >
            Lưu
          </Button>
          <></>
        </Group>
      </Box>
    </>
  );
};

export default CreateDataView;

type CreateDataViewProps = {
  onClose: any;
};
