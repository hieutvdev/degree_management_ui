import {
  Box,
  Button,
  ComboboxItem,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  ModelDegreeManagementQuery,
  UpdateDegreeManagementModel,
} from "../../../interfaces/DegreeManagement";
import { useForm } from "@mantine/form";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { handleKeyDownNumber } from "../../../helpers/FunctionHelper";
import { IconCheck, IconWindow } from "@tabler/icons-react";

const EditDataView = ({ id, onClose }: EditDataViewProps) => {
  const entity = {
    id: id,
    stundentId: null,
    degreeTypeId: null,
    code: null,
    regNo: null,
    creditsRequired: null,
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

  const form = useForm<UpdateDegreeManagementModel>({
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
      creditsRequired: (value: number | null) => {
        if (!value) {
          return "Vui lòng nhập số tín chỉ cần tích lũy !";
        }
      },
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

  const callApiGetData = async () => {
    open();
    const url = `${API_ROUTER.DETAIL_DEGREE}?id=${id}`;
    const repo = new DegreeRepository<ModelDegreeManagementQuery>();
    const dataApi = await repo.get(url);

    if (dataApi) {
      const result = dataApi?.data;
      if (result != null) {
        form.setValues(result);
        form.resetDirty(result);
        Promise.all([getSelectStudentGraduated(), getSelectDegreeType()]);
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

  const handleUpdate = async (dataSubmit: UpdateDegreeManagementModel) => {
    open();
    const url = `${API_ROUTER.UPDATE_DEGREE}`;
    const repo = new DegreeRepository<UpdateDegreeManagementModel>();
    const dataApi = await repo.put(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Chỉnh sửa văn bằng thành công !",
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
    if (id) {
      callApiGetData();
    }
  }, [id]);

  return (
    <>
      <Box
        component="form"
        mx="auto"
        w={{ base: "250px", md: "350px", lg: "500px" }}
        onSubmit={form.onSubmit((e: UpdateDegreeManagementModel) => {
          handleUpdate(e);
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
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <NumberInput
              label="Số tín chỉ tích lũy"
              placeholder="Nhập số tín chỉ cần tích lũy"
              key={form.key("creditsRequired")}
              min={1}
              hideControls
              onKeyDown={handleKeyDownNumber}
              withAsterisk
              {...form.getInputProps("creditsRequired")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <Select
              label="Sinh viên"
              placeholder="Nhập tên sinh viên"
              data={dataStudentSelect}
              value={
                form.getValues().stundentId
                  ? form.getValues().stundentId?.toString()
                  : null
              }
              searchable
              clearable
              nothingFoundMessage="Không tìm thấy sinh viên !"
              withAsterisk
              {...form.getInputProps("stundentId")}
              onChange={(e) =>
                form.setValues((prev) => ({
                  ...prev,
                  stundentId: e ? Number(e) : null,
                }))
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <Select
              label="Loại văn bằng"
              placeholder="Chọn loại văn bằng"
              data={dataDegreeTypeSelect}
              value={
                form.getValues().degreeTypeId
                  ? form.getValues().degreeTypeId?.toString()
                  : null
              }
              withAsterisk
              {...form.getInputProps("degreeTypeId")}
              onChange={(e) =>
                form.setValues((prev) => ({
                  ...prev,
                  degreeTypeId: e ? Number(e) : null,
                }))
              }
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

export default EditDataView;

type EditDataViewProps = {
  id: any;
  onClose: any;
};
