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
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { IconCheck, IconWindow } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  ModelInventoryQuery,
  UpdateInventoryModel,
} from "../../../interfaces/Inventory";
import { handleKeyDownNumber } from "../../../helpers/FunctionHelper";
import { DateTimePicker } from "@mantine/dates";

const EditDataView = ({ id, onClose }: EditDataViewProps) => {
  const entity = {
    id: id,
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

  const form = useForm<UpdateInventoryModel>({
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

  const handleUpdate = async (dataSubmit: UpdateInventoryModel) => {
    open();
    const url = `${API_ROUTER.UPDATE_INVENTORY}`;
    const repo = new DegreeRepository<UpdateInventoryModel>();
    const dataApi = await repo.put(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Chỉnh sửa kho lưu tồn văn bằng thành công !",
      });
      modals.closeAll();
    }
    close();
  };

  const callApiGetData = async () => {
    open();
    const url = `${API_ROUTER.DETAIL_INVENTORY}?id=${id}`;
    const repo = new DegreeRepository<ModelInventoryQuery>();
    const dataApi = await repo.get(url);

    if (dataApi) {
      const result = dataApi?.data;
      if (result != null) {
        form.setValues((prev) => ({
          ...prev,
          degreeId: result.degreeId,
          warehouseId: result.warehouseId,
          quantity: result.quantity,
          issueDate: result.issueDate,
          status: result.status,
          description: result.description,
        }));
        form.resetDirty(result);
        Promise.all([getSelectDegree(), getSelectWareHouse()]);
      }
      close();
    } else {
      notifications.show({
        color: "red",
        message: "Dữ liệu không tồn tại !",
      });
      modals.closeAll();
    }
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
    if (id) {
      callApiGetData();
    }
  }, [id]);

  return (
    <>
      <Box
        component="form"
        mx="auto"
        w={{ base: "250px", md: "300px", lg: "400px" }}
        onSubmit={form.onSubmit((e: UpdateInventoryModel) => {
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
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <Select
              label="Văn bằng"
              placeholder="Chọn văn bằng"
              data={dataDegreeSelect}
              value={
                form.getValues().degreeId
                  ? form.getValues().degreeId?.toString()
                  : null
              }
              searchable
              clearable
              withAsterisk
              nothingFoundMessage="Không tìm thấy văn bằng !"
              {...form.getInputProps("degreeId")}
              onChange={(e) =>
                form.setValues((prev) => ({
                  ...prev,
                  degreeId: e ? Number(e) : null,
                }))
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <Select
              label="Kho văn bằng"
              placeholder="Nhập tên kho văn bằng"
              data={dataWareHouseSelect}
              value={
                form.getValues().warehouseId
                  ? form.getValues().warehouseId?.toString()
                  : null
              }
              searchable
              clearable
              withAsterisk
              nothingFoundMessage={"Không tìm thấy kho văn bằng !"}
              {...form.getInputProps("warehouseId")}
              onChange={(e) =>
                form.setValues((prev) => ({
                  ...prev,
                  warehouseId: e ? Number(e) : null,
                }))
              }
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
              key={form.key("quantity")}
              {...form.getInputProps("quantity")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <DateTimePicker
              label="Ngày cấp văn bằng"
              placeholder="Nhập ngày cấp văn bằng"
              withAsterisk
              value={
                form.getValues().issueDate
                  ? new Date(form.getValues().issueDate ?? "")
                  : null
              }
              {...form.getInputProps("issueDate")}
              onChange={(e) =>
                form.setValues((prev) => ({
                  ...prev,
                  issueDate: e ? new Date(e)?.toISOString() : null,
                }))
              }
              minDate={new Date()}
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
            <Checkbox
              label={"Sử dụng"}
              checked={form.getValues().status}
              {...form.getInputProps("status")}
              onClick={() =>
                form.setValues((prev) => ({
                  ...prev,
                  active: !form.getValues().status,
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
