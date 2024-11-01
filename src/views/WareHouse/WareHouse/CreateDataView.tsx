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
import { handleKeyDownNumber } from "../../../helpers/FunctionHelper";
import { CreateWareHouseModel } from "../../../interfaces/WareHouse";

const CreateDataView = ({ onClose }: CreateDataViewProps) => {
  const entity = {
    name: null,
    code: null,
    active: false,
    description: "",
  };

  const [dataStudentSelect, setDataStudentSelect] = useState<ComboboxItem[]>(
    []
  );
  const [dataDegreeTypeSelect, setDataDegreeTypeSelect] = useState<
    ComboboxItem[]
  >([]);
  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<CreateWareHouseModel>({
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

  const handleCreate = async (dataSubmit: CreateWareHouseModel) => {
    open();
    const url = `${API_ROUTER.CREATE_WAREHOUSE}`;
    const repo = new DegreeRepository<CreateWareHouseModel>();
    const dataApi = await repo.post(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Tạo kho văn bằng thành công !",
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
        onSubmit={form.onSubmit((e: CreateWareHouseModel) => {
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
        </Group>
      </Box>
    </>
  );
};

export default CreateDataView;

type CreateDataViewProps = {
  onClose: any;
};
