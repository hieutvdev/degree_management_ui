import {
  Box,
  Button,
  ComboboxItem,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { modals } from "@mantine/modals";
import { IconWindow } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { ModelInventoryQuery } from "../../../interfaces/Inventory";

const DetailDataView = ({ id }: DetailDataViewProps) => {
  const entity = {
    id: id,
    degreeTypeId: null,
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

  const form = useForm<any>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },
  });

  const callApiGetData = async () => {
    open();
    const url = `${API_ROUTER.GET_DETAIL_INVENTORY}?id=${id}`;
    const repo = new DegreeRepository<ModelInventoryQuery>();
    const dataApi = await repo.get(url);

    if (dataApi) {
      const result = dataApi?.data;
      if (result != null) {
        form.setValues(result);
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
    const url = `${API_ROUTER.GET_SELECT_DEGREETYPE}`;
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
                form.getValues().degreeTypeId
                  ? form.getValues().degreeTypeId?.toString()
                  : null
              }
              searchable
              clearable
              readOnly
              variant="filled"
              nothingFoundMessage="Không tìm thấy văn bằng !"
              {...form.getInputProps("degreeId")}
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
              readOnly
              variant="filled"
              nothingFoundMessage={"Không tìm thấy kho văn bằng !"}
              {...form.getInputProps("warehouseId")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 3.5 }}>
            <NumberInput
              label="Số lượng"
              placeholder="Nhập số lượng"
              value={form.getValues().quantity}
              readOnly
              variant="filled"
              hideControls
              {...form.getInputProps("quantity")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 8.5 }}>
            <TextInput
              label="Ghi chú"
              placeholder="Nhập ghi chú"
              variant="filled"
              readOnly
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
        </Group>
      </Box>
    </>
  );
};

export default DetailDataView;

type DetailDataViewProps = {
  id: any;
};
