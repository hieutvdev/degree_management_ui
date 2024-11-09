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
import { StockInInventoryModel } from "../../../interfaces/Inventory";

const StockInInventory = ({ onClose }: StockInInventoryProps) => {
  const entity = {
    warehouseId: null,
    degreeTypeId: null,
    quantity: null,
    description: "",
  };

  const [dataDegreeTypeSelect, setDataDegreeTypeSelect] = useState<
    ComboboxItem[]
  >([]);
  const [dataWareHouseSelect, setDataWareHouseSelect] = useState<
    ComboboxItem[]
  >([]);

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<StockInInventoryModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    transformValues: (values) => ({
      ...values,
      degreeTypeId: Number(values.degreeTypeId),
      warehouseId: Number(values.warehouseId),
    }),

    validate: {
      degreeTypeId: (value: number | null) => {
        if (!value) {
          return "Vui lòng nhập loại văn bằng !";
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
    },
  });

  const handleCreate = async (dataSubmit: StockInInventoryModel) => {
    open();
    const url = `${API_ROUTER.STOCK_IN_INVENTORY}`;
    const repo = new DegreeRepository<StockInInventoryModel>();
    const dataApi = await repo.post(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Nhập kho thành công !",
      });
      modals.closeAll();
    }
    close();
  };

  const getSelectDegreeType = async () => {
    const url = `${API_ROUTER.GET_SELECT_DEGREETYPE}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataDegreeTypeSelect(
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
    Promise.all([getSelectDegreeType(), getSelectWareHouse()]);
  }, []);

  return (
    <>
      <Box
        component="form"
        mx="auto"
        w={{ base: "250px", md: "300px", lg: "400px" }}
        onSubmit={form.onSubmit((e: StockInInventoryModel) => {
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
              label="Loại văn bằng"
              placeholder="Chọn văn bằng"
              data={dataDegreeTypeSelect}
              searchable
              clearable
              withAsterisk
              nothingFoundMessage="Không tìm thấy văn bằng !"
              {...form.getInputProps("degreeTypeId")}
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
          <Grid.Col span={{ base: 12, md: 12, lg: 3.5 }}>
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
          <Grid.Col span={{ base: 12, md: 12, lg: 8.5 }}>
            <TextInput
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

export default StockInInventory;

type StockInInventoryProps = {
  onClose: any;
};
