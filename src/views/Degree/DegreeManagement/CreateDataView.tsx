import {
  Box,
  Button,
  Checkbox,
  ComboboxItem,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconWindow } from "@tabler/icons-react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { CreateDegreeManagementModel } from "../../../interfaces/DegreeManagement";
import { handleKeyDownNumber } from "../../../helpers/FunctionHelper";

const CreateDataView = ({ onClose }: CreateDataViewProps) => {
  const entity = {
    stundentId: null,
    degreeTypeId: null,
    code: null,
    regNo: null,
    // creditsRequired: null,
    status: 0,
    description: "",
  };

  const [dataStudentSelect, setDataStudentSelect] = useState<ComboboxItem[]>(
    []
  );
  const [dataDegreeTypeSelect, setDataDegreeTypeSelect] = useState<
    ComboboxItem[]
  >([]);
  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<CreateDegreeManagementModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    transformValues: (values) => ({
      ...values,
      stundentId: Number(values.stundentId),
      degreeTypeId: Number(values.degreeTypeId),
    }),

    validate: {
      code: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập số hiệu !";
        }
      },
      // creditsRequired: (value: number | null) => {
      //   if (!value) {
      //     return "Vui lòng nhập số tín chỉ cần tích lũy !";
      //   }
      // },
      stundentId: (value: number | null) => {
        if (!value) {
          return "Vui lòng nhập sinh viên cần cấp văn bằng !";
        }
      },
      degreeTypeId: (value: number | null) => {
        if (!value) {
          return "Vui lòng chọn loại văn bằng !";
        }
      },
    },
  });

  const handleCreate = async (dataSubmit: CreateDegreeManagementModel) => {
    open();
    const url = `${API_ROUTER.CREATE_DEGREE}`;
    const repo = new DegreeRepository<CreateDegreeManagementModel>();
    const dataApi = await repo.post(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Tạo văn bằng thành công !",
      });
      modals.closeAll();
    }
    close();
  };

  const getSelectStudentGraduated = async () => {
    const url = `${API_ROUTER.GET_SELECT_STUDENT}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataStudentSelect(
        result
          ?.filter((item: any) => item.text != null && item.value != null)
          ?.map((item: any) => ({
            label: item.text,
            value: item.value?.toString(),
          }))
      );
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

  useEffect(() => {
    Promise.all([getSelectStudentGraduated(), getSelectDegreeType()]);
  }, []);

  return (
    <>
      <Box
        component="form"
        mx="auto"
        w={{ base: "250px", md: "350px", lg: "500px" }}
        onSubmit={form.onSubmit((e: CreateDegreeManagementModel) => {
          handleCreate(e);
        })}
        style={{ position: "relative" }}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Grid mt={10}>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <TextInput
              label="Số hiệu"
              placeholder="Nhập số hiệu"
              withAsterisk
              {...form.getInputProps("code")}
            />
          </Grid.Col>
          {/* <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <NumberInput
              label="Số tín chỉ tích lũy"
              placeholder="Nhập số tín chỉ cần tích lũy"
              min={1}
              hideControls
              onKeyDown={handleKeyDownNumber}
              withAsterisk
              {...form.getInputProps("creditsRequired")}
            />
          </Grid.Col> */}
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <Select
              label="Sinh viên"
              placeholder="Nhập tên sinh viên"
              data={dataStudentSelect}
              searchable
              clearable
              nothingFoundMessage="Không tìm thấy sinh viên !"
              withAsterisk
              {...form.getInputProps("stundentId")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <Select
              label="Loại văn bằng"
              placeholder="Chọn loại văn bằng"
              data={dataDegreeTypeSelect}
              withAsterisk
              {...form.getInputProps("degreeTypeId")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <TextInput
              label="Số vào sổ"
              placeholder="Nhập số vào sổ"
              {...form.getInputProps("regNo")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <Select
              label="Đã cấp văn bằng"
              data={[
                { label: "Chưa cấp văn bằng", value: "0" },
                { label: "Đang cấp văn bằng", value: "1" },
                { label: "Đã cấp văn bằng", value: "2" },
              ]}
              value={form.getValues().status?.toString()}
              {...form.getInputProps("status")}
              onChange={(e) =>
                form.setValues((prev) => ({
                  ...prev,
                  status: e ? Number(e) : 0,
                }))
              }
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Mô tả"
              placeholder="Nhập mô tả"
              {...form.getInputProps("description")}
            />
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
            loading={visible}
            leftSection={!visible ? <IconCheck size={18} /> : undefined}
          >
            Lưu
          </Button>
        </Group>
      </Box>
    </>
  );
};

export default CreateDataView;

type CreateDataViewProps = {
  onClose: any;
};
