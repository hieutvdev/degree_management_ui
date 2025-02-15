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
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeTypeModelQuery } from "../../../interfaces/DegreeType";
import { DegreeRepository } from "../../../services/RepositoryBase";

const DetailDataView = ({ id }: DetailDataViewProps) => {
  const entity = {
    id: 0,
    code: null,
    name: null,
    active: false,
    duration: null,
    descripion: "",
    level: null,
    specializationId: null,
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const [dataSpecializationSelect, setDataSpecializationSelect] = useState<
    ComboboxItem[]
  >([]);

  const form = useForm<any>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },
  });

  const callApiGetData = async () => {
    open();
    const url = `${API_ROUTER.DETAIL_DEGREETYPE}?id=${id}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi) {
      const result = dataApi?.data;
      if (result != null) {
        form.setValues(result);
        Promise.all([getSelectSpecialization()]);
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

  const getSelectSpecialization = async () => {
    const url = `${API_ROUTER.GET_SELECT_SPECIALIZATION}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataSpecializationSelect(
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
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <TextInput
            readOnly
            variant="filled"
            label={"Mã loại văn bằng"}
            placeholder={"Nhập mã loại văn bằng"}
            {...form.getInputProps("code")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <TextInput
            readOnly
            variant="filled"
            label={"Tên loại văn bằng"}
            placeholder={"Nhập tên loại văn bằng"}
            {...form.getInputProps("name")}
          />
        </Grid.Col>
      </Grid>

      <Grid mt={10}>
        <Grid.Col span={12}>
          <Select
            readOnly
            variant="filled"
            label={"Cấp độ"}
            placeholder={"Chọn cấp độ"}
            data={[
              { value: "0", label: "Đại học" },
              { value: "1", label: "Sau đại học" },
            ]}
            value={form.getValues().level?.toString()}
            {...form.getInputProps("level")}
          />
        </Grid.Col>
      </Grid>

      <Grid align="center">
        <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
          <Textarea
            readOnly
            variant="filled"
            label={"Ghi chú"}
            placeholder="Nhập ghi chú"
            {...form.getInputProps("description")}
          />
        </Grid.Col>
      </Grid>

      <Group
        justify="end"
        mt="md"
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
          leftSection={!visible ? <IconX size={18} /> : undefined}
        >
          Đóng
        </Button>
        <></>
      </Group>
    </Box>
  );
};

export default DetailDataView;

type DetailDataViewProps = {
  id: string | number;
};
