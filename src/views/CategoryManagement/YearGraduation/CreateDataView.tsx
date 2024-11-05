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
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { CreateYearGraduationModel } from "../../../interfaces/YearGraduation";
import { YearPickerInput } from "@mantine/dates";

const CreateDataView = ({ onClose }: CreateDataViewProps) => {
  const entity = {
    name: null,
    active: false,
    description: "",
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<CreateYearGraduationModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    transformValues: (values) => ({
      ...values,
      name: new Date(values.name ?? "").getFullYear()?.toString(),
    }),

    validate: {
      name: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập tên khoa!";
        }
      },
    },
  });

  const handleCreate = async (dataSubmit: CreateYearGraduationModel) => {
    open();
    const url = `${API_ROUTER.CREATE_YEAR_GRADUATION}`;
    const repo = new DegreeRepository<CreateYearGraduationModel>();
    const dataApi = await repo.post(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Thêm năm tốt nghiệp thành công !",
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
        onSubmit={form.onSubmit((e: CreateYearGraduationModel) => {
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
            <YearPickerInput
              label={"Tên năm tốt nghiệp"}
              placeholder={"Nhập tên năm tốt nghiệp"}
              withAsterisk
              {...form.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label={"Ghi chú"}
              placeholder="Nhập ghi chú"
              {...form.getInputProps("description")}
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
