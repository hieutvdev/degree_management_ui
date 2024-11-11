import {
  Box,
  Button,
  Checkbox,
  Grid,
  Group,
  LoadingOverlay,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { IconCheck, IconWindow } from "@tabler/icons-react";
import { UpdateWareHouseModel } from "../../../interfaces/WareHouse";
import { useEffect } from "react";

const EditDataView = ({ id, onClose }: EditDataViewProps) => {
  const entity = {
    id: id,
    name: null,
    code: null,
    active: false,
    description: "",
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<UpdateWareHouseModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    validate: {
      code: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập mã kho !";
        }
      },
      name: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập tên kho !";
        }
      },
    },
  });

  const handleUpdate = async (dataSubmit: UpdateWareHouseModel) => {
    open();
    const url = `${API_ROUTER.UPDATE_WAREHOUSE}`;
    const repo = new DegreeRepository<UpdateWareHouseModel>();
    const dataApi = await repo.put(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Chỉnh sửa kho văn bằng thành công !",
      });
      modals.closeAll();
    }
    close();
  };

  const getDataDetail = async () => {
    const url = `${API_ROUTER.DETAIL_WAREHOUSE}`;
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
    <>
      <Box
        component="form"
        mx="auto"
        w={{ base: "250px", md: "300px", lg: "400px" }}
        onSubmit={form.onSubmit((e: UpdateWareHouseModel) => {
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
          <Grid.Col span={{ base: 12, md: 6, lg: 4.5 }}>
            <TextInput
              label={"Mã kho văn bằng"}
              placeholder={"Nhập mã kho văn bằng"}
              withAsterisk
              {...form.getInputProps("code")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 7.5 }}>
            <TextInput
              label={"Tên kho văn bằng"}
              placeholder={"Nhập tên kho văn bằng"}
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

export default EditDataView;

type EditDataViewProps = {
  id: any;
  onClose: any;
};
