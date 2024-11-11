import {
  Box,
  Button,
  Checkbox,
  ComboboxItem,
  Grid,
  Group,
  LoadingOverlay,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconWindow } from "@tabler/icons-react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { CreateSpecializationModel } from "../../../interfaces/Specialization";

const CreateDataView = ({ onClose }: CreateDataViewProps) => {
  const entity = {
    name: null,
    code: null,
    active: true,
    description: null,
    majorId: null,
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const [dataMajorSelect, setDataMajorSelect] = useState<ComboboxItem[]>([]);

  const form = useForm<CreateSpecializationModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    transformValues: (values) => ({
      ...values,
      majorId: Number(values.majorId),
    }),

    validate: {
      code: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập mã chuyên ngành !";
        }
      },
      name: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập tên chuyên ngành !";
        }
      },
      majorId: (value: number | null) => {
        if (!value) {
          return "Vui lòng nhập ngành !";
        }
      },
    },
  });

  const handleCreate = async (dataSubmit: CreateSpecializationModel) => {
    open();
    const url = `${API_ROUTER.CREATE_SPECIALIZATION}`;
    const repo = new DegreeRepository<CreateSpecializationModel>();
    const dataApi = await repo.post(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Thêm chuyên ngành thành công !",
      });
      modals.closeAll();
    }
    close();
  };

  const getMajorSelect = async () => {
    const url = `${API_ROUTER.GET_SELECT_MAJOR}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataMajorSelect(
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
    Promise.all([getMajorSelect()]);
  }, []);

  return (
    <>
      <Box
        component="form"
        mx="auto"
        w={{ base: "250px", md: "300px", lg: "400px" }}
        onSubmit={form.onSubmit((e: CreateSpecializationModel) => {
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
              label={"Mã chuyên ngành"}
              placeholder={"Nhập mã chuyên ngành"}
              withAsterisk
              {...form.getInputProps("code")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <TextInput
              label={"Tên chuyên ngành"}
              placeholder={"Nhập tên chuyên ngành"}
              withAsterisk
              {...form.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Select
              label="Ngành"
              placeholder="Nhập tên ngành"
              data={dataMajorSelect}
              searchable
              clearable
              nothingFoundMessage="Không tìm thấy ngành !"
              withAsterisk
              {...form.getInputProps("majorId")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label={"Ghi chú"}
              placeholder="Nhập ghi chú"
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
