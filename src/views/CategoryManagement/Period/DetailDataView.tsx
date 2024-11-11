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
import { DateTimePicker } from "@mantine/dates";

const DetailDataView = ({ id }: DetailDataViewProps) => {
  const entity = {
    id: id,
    name: null,
    startDate: null,
    endDate: null,
    active: false,
    description: null,
    yearGraduationId: null,
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const [dataYearGraduationSelect, setDataYearGraduationSelect] = useState<
    ComboboxItem[]
  >([]);

  const form = useForm<any>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },
  });

  const getDataDetail = async () => {
    const url = `${API_ROUTER.GET_DETAIL_PERIOD}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url + `?id=${id}`);

    if (dataApi?.isSuccess) {
      form.setValues(dataApi?.data);
      Promise.all([getYearGraduationSelect()]);
    } else {
      modals.closeAll();
    }
  };

  const getYearGraduationSelect = async () => {
    const url = `${API_ROUTER.GET_SELECT_YEAR_GRADUATION}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataYearGraduationSelect(
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
              label={"Đợt tốt nghiệp"}
              placeholder={"Nhập đợt năm tốt nghiệp"}
              {...form.getInputProps("name")}
              readOnly
              variant="filled"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <Select
              label="Năm tốt nghiệp"
              placeholder="Chọn năm tốt nghiệp"
              data={dataYearGraduationSelect}
              value={
                form.getValues().yearGraduationId
                  ? form.getValues().yearGraduationId?.toString()
                  : null
              }
              {...form.getInputProps("yearGraduationId")}
              readOnly
              variant="filled"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <DateTimePicker
              label="Ngày bắt đầu"
              placeholder="Nhập ngày bắt đầu"
              valueFormat="DD/MM/YYYY"
              value={
                form.getValues().startDate
                  ? new Date(form.getValues().startDate ?? "")
                  : null
              }
              {...form.getInputProps("startDate")}
              variant="filled"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <DateTimePicker
              label="Ngày kết thúc"
              placeholder="Nhập ngày kết thúc"
              valueFormat="DD/MM/YYYY"
              value={
                form.getValues().endDate
                  ? new Date(form.getValues().endDate ?? "")
                  : null
              }
              {...form.getInputProps("endDate")}
              variant="filled"
              readOnly
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
