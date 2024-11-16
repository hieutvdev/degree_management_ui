import { useForm } from "@mantine/form";
import { CreateRoleModel } from "../../../interfaces/Role";
import { useDisclosure } from "@mantine/hooks";
import {
  Box,
  Button,
  Grid,
  Group,
  LoadingOverlay,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

const CreateDataView = ({ onClose }: CreateDataViewProps) => {
  const entity = {
    name: null,
    description: "",
    status: 0,
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<CreateRoleModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    validate: {
      name: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập tên chức danh !";
        }
      },
    },
  });

  const handleCreate = async (dataSubmit: CreateRoleModel) => {
    open();
    const url = `${API_ROUTER.CREATE_ROLE}`;
    const repo = new DegreeRepository<CreateRoleModel>();
    const dataApi = await repo.post(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Thêm chức danh thành công !",
      });
      modals.closeAll();
    }
    close();
  };

  return (
    <Box
      component="form"
      mx="auto"
      w={{ base: "250px", md: "300px", lg: "400px" }}
      onSubmit={form.onSubmit((e: CreateRoleModel) => {
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
        <Grid.Col span={12}>
          <TextInput
            label="Tên chức danh"
            placeholder="Nhập tên chức danh"
            {...form.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            label="Ghi chú"
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
          type="submit"
          loading={visible}
          leftSection={!visible ? <IconCheck size={18} /> : undefined}
        >
          Lưu
        </Button>
      </Group>
    </Box>
  );
};

export default CreateDataView;

type CreateDataViewProps = {
  onClose: any;
};
