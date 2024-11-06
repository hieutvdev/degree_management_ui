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
import { IconCheck, IconWindow } from "@tabler/icons-react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { UpdatePeriodModel } from "../../../interfaces/Period";
import { DateTimePicker } from "@mantine/dates";

const EditDataView = ({ id, onClose }: EditDataViewProps) => {
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

  const form = useForm<UpdatePeriodModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    transformValues: (values) => ({
      ...values,
      yearGraduationId: Number(values.yearGraduationId),
    }),

    validate: {
      name: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập tên khoa!";
        }
      },
      startDate: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập ngày bắt đầu !";
        }
      },
      endDate: (value: string | null) => {
        if (!value) {
          return "Vui lòng chọn ngày kết thúc !";
        }
      },
      yearGraduationId: (value: number | null) => {
        if (!value) {
          return "Vui lòng chọn năm tốt nghiệp !";
        }
      },
    },
  });

  const handleUpdate = async (dataSubmit: UpdatePeriodModel) => {
    open();
    const url = `${API_ROUTER.UPDATE_PERIOD}`;
    const repo = new DegreeRepository<UpdatePeriodModel>();
    const dataApi = await repo.put(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Chỉnh sửa đợt tốt nghiệp thành công !",
      });
      modals.closeAll();
    }
    close();
  };

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
        onSubmit={form.onSubmit((e: UpdatePeriodModel) => {
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
            <TextInput
              label={"Đợt tốt nghiệp"}
              placeholder={"Nhập đợt năm tốt nghiệp"}
              withAsterisk
              {...form.getInputProps("name")}
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
              onChange={(e) =>
                form.setValues((prev) => ({
                  ...prev,
                  yearGraduationId: e ? Number(e) : null,
                }))
              }
              withAsterisk
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
              onChange={(e) =>
                form.setValues((prev) => ({
                  ...prev,
                  startDate: e ? new Date(e ?? "").toISOString() : null,
                }))
              }
              withAsterisk
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
              onChange={(e) =>
                form.setValues((prev) => ({
                  ...prev,
                  endDate: e ? new Date(e ?? "").toISOString() : null,
                }))
              }
              withAsterisk
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
            <Checkbox
              label={"Sử dụng"}
              checked={form.getValues().active}
              {...form.getInputProps("active")}
              onClick={() =>
                form.setValues((prev) => ({
                  ...prev,
                  active: !form.getValues().active,
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
