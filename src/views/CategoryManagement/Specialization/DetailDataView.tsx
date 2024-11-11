import {
  Box,
  Button,
  Checkbox,
  ComboboxItem,
  Grid,
  Group,
  LoadingOverlay,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconWindow } from "@tabler/icons-react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

const DetailDataView = ({ id }: DetailDataViewProps) => {
  const entity = {
    id: id,
    name: null,
    code: null,
    active: false,
    description: null,
    majorId: null,
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const [dataMajorSelect, setDataMajorSelect] = useState<ComboboxItem[]>([]);

  const form = useForm<any>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },
  });

  const getDataDetail = async () => {
    const url = `${API_ROUTER.GET_DETAIL_SPECIALIZATION}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url + `?id=${id}`);

    if (dataApi?.isSuccess) {
      form.setValues(dataApi?.data);
      Promise.all([getMajorSelect()]);
    } else {
      modals.closeAll();
    }
  };

  const getMajorSelect = async () => {
    const url = `${API_ROUTER.GET_SELECT_MAJOR}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataMajorSelect(
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
      getDataDetail();
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
            <TextInput
              label={"Mã chuyên ngành"}
              placeholder={"Nhập mã chuyên ngành"}
              variant="filled"
              readOnly
              {...form.getInputProps("code")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <TextInput
              label={"Tên chuyên ngành"}
              placeholder={"Nhập tên chuyên ngành"}
              variant="filled"
              readOnly
              {...form.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Select
              label="Ngành"
              placeholder="Nhập tên ngành"
              data={dataMajorSelect}
              value={
                form.getValues().majorId
                  ? form.getValues().majorId?.toString()
                  : null
              }
              searchable
              clearable
              nothingFoundMessage="Không tìm thấy ngành !"
              variant="filled"
              readOnly
              {...form.getInputProps("majorId")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label={"Ghi chú"}
              placeholder="Nhập ghi chú"
              {...form.getInputProps("description")}
              variant="filled"
              readOnly
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
