import {
  Box,
  Button,
  Checkbox,
  Grid,
  Group,
  LoadingOverlay,
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
import { UpdateYearGraduationModel } from "../../../interfaces/YearGraduation";
import { YearPickerInput } from "@mantine/dates";

const EditDataView = ({ id, onClose }: EditDataViewProps) => {
  const entity = {
    id: id,
    name: null,
    active: false,
    description: "",
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<UpdateYearGraduationModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    transformValues: (values) => ({
      ...values,
      name: new Date(values.name ?? "").getFullYear()?.toString(),
    }),

    validate: {
      name: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập năm tốt nghiệp!";
        }
      },
    },
  });

  const handleUpdate = async (dataSubmit: UpdateYearGraduationModel) => {
    open();
    const url = `${API_ROUTER.UPDATE_YEAR_GRADUATION}`;
    const repo = new DegreeRepository<UpdateYearGraduationModel>();
    const dataApi = await repo.put(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Chỉnh sửa năm tốt nghiệp thành công !",
      });
      modals.closeAll();
    }
    close();
  };

  const getDataDetail = async () => {
    const url = `${API_ROUTER.GET_DETAIL_YEAR_GRADUATION}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url + `?id=${id}`);

    if (dataApi?.isSuccess) {
      form.setValues(dataApi?.data);
    } else {
      modals.closeAll();
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
        onSubmit={form.onSubmit((e: UpdateYearGraduationModel) => {
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
          <Grid.Col span={12}>
            <YearPickerInput
              label={"Năm tốt nghiệp"}
              placeholder={"Nhập năm tốt nghiệp"}
              value={
                form.getValues().name
                  ? new Date(form.getValues().name ?? "")
                  : null
              }
              withAsterisk
              {...form.getInputProps("name")}
              onChange={(e) =>
                form.setValues((prev) => ({
                  ...prev,
                  name: e ? new Date(e ?? "").getFullYear.toString() : null,
                }))
              }
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label={"Ghi chú"}
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

export default EditDataView;

type EditDataViewProps = {
  id: any;
  onClose: any;
};
