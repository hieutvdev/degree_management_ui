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
import { CreateInventoryModel } from "../../../interfaces/Inventory";
import { useEffect, useState } from "react";
import { handleKeyDownNumber } from "../../../helpers/FunctionHelper";
import { DateTimePicker } from "@mantine/dates";

const CreateDataView = ({ onClose }: CreateDataViewProps) => {
  const entity = {
    degreeId: null,
    warehouseId: null,
    quantity: null,
    issueDate: null,
    status: false,
    description: "",
  };

  const [dataDegreeSelect, setDataDegreeSelect] = useState<ComboboxItem[]>([]);
  const [dataWareHouseSelect, setDataWareHouseSelect] = useState<
    ComboboxItem[]
  >([]);

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<CreateInventoryModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    transformValues: (values) => ({
      ...values,
      degreeId: Number(values.degreeId),
      warehouseId: Number(values.warehouseId),
    }),

    validate: {
      degreeId: (value: number | null) => {
        if (!value) {
          return "Vui lòng nhập văn bằng !";
        }
      },
      warehouseId: (value: number | null) => {
        if (!value) {
          return "Vui lòng nhập kho !";
        }
      },
      quantity: (value: number | null) => {
        if (!value) {
          return "Vui lòng nhập số lượng !";
        }
      },
      issueDate: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập ngày cấp văn bằng !";
        }
      },
    },
  });

  const handleCreate = async (dataSubmit: CreateInventoryModel) => {
    open();
    const url = `${API_ROUTER.CREATE_INVENTORY}`;
    const repo = new DegreeRepository<CreateInventoryModel>();
    const dataApi = await repo.post(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Tạo kho lưu tồn văn bằng thành công !",
      });
      modals.closeAll();
    }
    close();
  };

  const getSelectDegree = async () => {
    const url = `${API_ROUTER.GET_SELECT_DEGREE}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataDegreeSelect(
        result
          ?.filter((item: any) => item.text != null && item.value != null)
          ?.map((item: any) => ({
            label: item.text,
            value: item.value?.toString(),
          }))
      );
    }
  };

  const getSelectWareHouse = async () => {
    const url = `${API_ROUTER.GET_SELECT_WAREHOUSE}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataWareHouseSelect(
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
    Promise.all([getSelectDegree(), getSelectWareHouse()]);
  }, []);

  console.log(form.getValues());

  return (
    <>
      <Box
        component="form"
        mx="auto"
        w={{ base: "250px", md: "300px", lg: "400px" }}
        onSubmit={form.onSubmit((e: CreateInventoryModel) => {
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
            <Select
              label="Văn bằng"
              placeholder="Chọn văn bằng"
              data={dataDegreeSelect}
              searchable
              clearable
              withAsterisk
              nothingFoundMessage="Không tìm thấy văn bằng !"
              {...form.getInputProps("degreeId")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <Select
              label="Kho văn bằng"
              placeholder="Nhập tên kho văn bằng"
              data={dataWareHouseSelect}
              searchable
              clearable
              withAsterisk
              nothingFoundMessage={"Không tìm thấy kho văn bằng !"}
              {...form.getInputProps("warehouseId")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <NumberInput
              label="Số lượng"
              placeholder="Nhập số lượng"
              min={1}
              hideControls
              onKeyDown={handleKeyDownNumber}
              withAsterisk
              {...form.getInputProps("quantity")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <DateTimePicker
              label="Ngày cấp văn bằng"
              placeholder="Nhập ngày cấp văn bằng"
              withAsterisk
              key={form.key("issueDate")}
              minDate={new Date()}
              {...form.getInputProps("issueDate")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Ghi chú"
              placeholder="Nhập ghi chú"
              {...form.getInputProps("description")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Checkbox label="Sử dụng" {...form.getInputProps("status")} />
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
