import {
  Box,
  Button,
  Checkbox,
  ComboboxItem,
  Grid,
  Group,
  LoadingOverlay,
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
import { UpdateMajorModel } from "../../../interfaces/Major";

const DetailDataView = ({ id }: EditDataViewProps) => {
  const entity = {
    id: id,
    name: null,
    code: null,
    active: null,
    description: null,
    facultyId: 0,
  };

  const [dataFacultySelect, setDataFacultySelect] = useState<ComboboxItem[]>(
    []
  );
  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<UpdateMajorModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },
  });

  const getDataDetail = async () => {
    const url = `${API_ROUTER.DETAIL_MAJOR}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url + `?id=${id}`);

    if (dataApi?.isSuccess) {
      form.setValues(dataApi?.data);
      Promise.all([getSelectFaculty()]);
    } else {
      modals.closeAll();
    }
  };

  const getSelectFaculty = async () => {
    const url = `${API_ROUTER.GET_SELECT_FACULTY}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataFacultySelect(
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
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput
              label={"Mã ngành"}
              placeholder={"Nhập mã ngành"}
              readOnly
              variant="filled"
              {...form.getInputProps("code")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
            <TextInput
              label={"Tên ngành"}
              placeholder={"Nhập tên ngành"}
              readOnly
              variant="filled"
              {...form.getInputProps("name")}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={12}>
            <Select
              label="Khoa"
              placeholder="Chọn khoa"
              data={dataFacultySelect}
              value={
                form.getValues().facultyId
                  ? form.getValues().facultyId?.toString()
                  : null
              }
              searchable
              clearable
              nothingFoundMessage="Không tìm thấy dữ liệu !"
              {...form.getInputProps("facultyId")}
              variant="filled"
              readOnly
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={12}>
            <Textarea
              label={"Ghi chú"}
              placeholder="Nhập ghi chú"
              value={form.getValues().description}
              {...form.getInputProps("description")}
              variant="filled"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
            <Checkbox
              label={"Sử dụng"}
              checked={form.getValues().active}
              {...form.getInputProps("active")}
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

export default DetailDataView;

type EditDataViewProps = {
  id: any;
};
