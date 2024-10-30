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
import { ResponseBase } from "../../../interfaces/ResponseBase";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

const CreateDataView = ({ onClose }: CreateDataViewProps) => {
  const entity = {
    name: null,
    code: null,
    active: false,
    description: null,
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<CreateFacultyModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },
  });

  const handleCreateFaculty = async (
    dataSubmit: ResponseBase<CreateFacultyModel>
  ) => {
    open();
    const url = `${API_ROUTER.CREATE_FACULTY}`;
    const repo = new DegreeRepository<ResponseBase<CreateFacultyModel>>();
    const dataApi = await repo.post(url, dataSubmit);

    if (dataApi && dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
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
              label={"Mã"}
              placeholder={"Nhập mã"}
              type="text"
              withAsterisk
              {...form.getInputProps("code")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
            <TextInput
              label={"Tên"}
              placeholder={"Nhập tên"}
              type="text"
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
              {...form.getInputProps("note")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
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
