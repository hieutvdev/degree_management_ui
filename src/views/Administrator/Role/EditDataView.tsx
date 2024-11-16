import { useForm } from "@mantine/form";
import { UpdateRoleModel } from "../../../interfaces/Role";
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
import { useEffect } from "react";

const EditDataView = ({ id, onClose }: EditDataViewProps) => {
  const entity = {
    id: id,
    name: null,
    description: "",
    status: 0,
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<UpdateRoleModel>({
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

  const handleUpdate = async (dataSubmit: UpdateRoleModel) => {
    open();
    const url = `${API_ROUTER.UPDATE_ROLE}`;
    const repo = new DegreeRepository<UpdateRoleModel>();
    const dataApi = await repo.put(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Chỉnh sửa chức danh thành công !",
      });
      modals.closeAll();
    }
    close();
  };

  const getDataDetail = async () => {
    const url = `${API_ROUTER.GET_DETAIL_ROLE}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url + `?id=${id}`);

    if (dataApi?.isSuccess) {
      form.setValues(dataApi?.data);
    } else {
      modals.closeAll();
    }
  };

  useEffect(() => {
    if (id) {
      getDataDetail();
    }
  }, [id]);

  return (
    <Box
      component="form"
      mx="auto"
      w={{ base: "250px", md: "300px", lg: "400px" }}
      onSubmit={form.onSubmit((e: UpdateRoleModel) => {
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
            value={
              form.getValues().description ? form.getValues().description : ""
            }
            {...form.getInputProps("description")}
            onChange={(e) =>
              form.setValues((prev) => ({
                ...prev,
                description: e.currentTarget.value,
              }))
            }
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

export default EditDataView;

type EditDataViewProps = {
  id: any;
  onClose: any;
};
