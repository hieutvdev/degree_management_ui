import {
  Box,
  Button,
  Checkbox,
  Grid,
  Group,
  LoadingOverlay,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconWindow } from "@tabler/icons-react";
import { CreateFacultyModel } from "../../../interfaces/Faculty";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

const CreateDataView = ({ onClose }: CreateDataViewProps) => {
  const entity = {
    name: null,
    code: null,
    active: true,
    description: "",
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<CreateFacultyModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    validate: {
      code: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập mã khoa!";
        }
      },
      name: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập tên khoa!";
        }
      },
    },
  });

  const handleCreateFaculty = async (dataSubmit: CreateFacultyModel) => {
    open();
    const url = `${API_ROUTER.CREATE_FACULTY}`;
    const repo = new DegreeRepository<CreateFacultyModel>();
    const dataApi = await repo.post(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Thêm khoa thành công !",
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
        onSubmit={form.onSubmit((e: CreateFacultyModel) => {
          handleCreateFaculty(e);
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
              label={"Mã khoa"}
              placeholder={"Nhập mã"}
              withAsterisk
              {...form.getInputProps("code")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
            <TextInput
              label={"Tên khoa"}
              placeholder={"Nhập tên khoa"}
              withAsterisk
              {...form.getInputProps("name")}
            />
          </Grid.Col>
        </Grid>

        <Grid align="center">
          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
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
