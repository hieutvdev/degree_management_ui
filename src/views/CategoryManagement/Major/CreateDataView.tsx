import {
  Box,
  Button,
  Checkbox,
  ComboboxItem,
  Grid,
  Group,
  LoadingOverlay,
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
import { CreateMajorModel } from "../../../interfaces/Major";
import { useEffect, useState } from "react";

const CreateDataView = ({ onClose }: CreateDataViewProps) => {
  const entity = {
    name: null,
    code: null,
    active: false,
    description: "",
    facultyId: 0,
  };

  const [dataFacultySelect, setDataFacultySelect] = useState<ComboboxItem[]>(
    []
  );
  console.log(dataFacultySelect);
  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<CreateMajorModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

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
      facultyId: (value: number) => {
        if (!value || value === 0) {
          return "Vui lòng chọn khoa của chuyên ngành !";
        }
      },
    },
  });

  const handleCreate = async (dataSubmit: CreateMajorModel) => {
    open();
    const url = `${API_ROUTER.CREATE_MAJOR}`;
    const repo = new DegreeRepository<CreateMajorModel>();
    const dataApi = await repo.post(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Thêm ngành thành công !",
      });
      modals.closeAll();
    }
    close();
  };

  const getSelectFaculty = async () => {
    const url = `${API_ROUTER.GET_SELECT_FACULTY}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataFacultySelect(
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
    if (dataFacultySelect.length === 0) {
      getSelectFaculty();
    }
  }, [dataFacultySelect]);

  return (
    <>
      <Box
        component="form"
        mx="auto"
        w={{ base: "250px", md: "300px", lg: "400px" }}
        onSubmit={form.onSubmit((e: CreateMajorModel) => {
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
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput
              label={"Mã ngành"}
              placeholder={"Nhập mã ngành"}
              withAsterisk
              {...form.getInputProps("code")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
            <TextInput
              label={"Tên ngành"}
              placeholder={"Nhập tên ngành"}
              withAsterisk
              {...form.getInputProps("name")}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={12}>
            <Select
              label="Khoa"
              placeholder="Chọn khoa"
              data={dataFacultySelect}
              searchable
              clearable
              nothingFoundMessage="Không tìm thấy dữ liệu !"
              withAsterisk
              {...form.getInputProps("facultyId")}
            />
          </Grid.Col>
        </Grid>
        <Grid>
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
