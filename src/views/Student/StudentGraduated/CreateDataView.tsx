import {
  Box,
  Button,
  Checkbox,
  ComboboxItem,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconWindow } from "@tabler/icons-react";
import { StudentGraduatedModelQuery } from "../../../interfaces/StudentGraduated";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { DateTimePicker, YearPickerInput } from "@mantine/dates";
import { SelectBase } from "../../../interfaces/SelectBase";
import { API_ROUTER } from "../../../constants/api/api_router";
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
  const [dataMajors, setDataMajors] = useState<ComboboxItem[]>();

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
      gender: (value: boolean | null) => {
        if (!value) {
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

  const getSelectMajor = async () => {
    try {
      const url = `${API_ROUTER.GET_SELECT_MAJORS}`;
      const repo = new DegreeRepository<SelectBase>();
      const dataApi = await repo.get(url);
      if (dataApi) {
        const result = dataApi;
        console.log(result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateTblDMInventory = async (
    dataSubmit: StudentGraduatedModelQuery
  ) => {
    open();
    console.log(dataSubmit);

    // const dataApi = await repositoryPos.post<MessageResponse<TblDMInventory>>(
    //   "/api/v1/TblDMInventory/create",
    //   dataSubmit
    // );
    // if (dataApi?.success) {
    //   onClose((prev: any) => !prev);
    //   modals.closeAll();
    // }
    onClose((prev: any) => !prev);

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
            <DateTimePicker
              label={"Ngày Sinh"}
              placeholder={"Chọn ngày sinh"}
              withAsterisk
              {...form.getInputProps("dateOfBirth")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label={"Giới tính"}
              placeholder={"Chọn giới tính"}
              type="number"
              data={[
                { value: "0", label: "Nam" },
                { value: "1", label: "Nữ" },
              ]}
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
              onClick={() => getSelectMajor()}
              {...form.getInputProps("majorId")}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label={"Mã vùng"}
              placeholder={"Nhập mã vùng"}
              type="text"
              {...form.getInputProps("positionId")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label={"Trung tâm khác"}
              placeholder={"Nhập trung tâm"}
              type="text"
              {...form.getInputProps("oldInventoryCode")}
            />
          </Grid.Col>
        </Grid>

        <Grid align="center">
          <Grid.Col span={6}>
            <TextInput
              label={"Mã kho ORC"}
              placeholder={"Nhập mã kho"}
              type="text"
              {...form.getInputProps("codeoracle")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label={"Tên loại kho"}
              placeholder={"Nhập loại kho"}
              type="number"
              {...form.getInputProps("type")}
            />
          </Grid.Col>
        </Grid>
        <Grid align="center">
          <Grid.Col span={12}>
            <Textarea
              label={"Ghi chú"}
              placeholder="Nhập ghi chú"
              w={"100%"}
              {...form.getInputProps("note")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Checkbox label={"Sử dụng"} {...form.getInputProps("active")} />
          </Grid.Col>
        </Grid>

        <Group
          justify="end"
          mt="xs"
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
            leftSection={!visible ? <IconWindow size={18} /> : undefined}
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
