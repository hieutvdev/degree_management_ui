import {
  Box,
  Button,
  Checkbox,
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
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeTypeModelQuery } from "../../../interfaces/DegreeType";
import { DegreeRepository } from "../../../services/RepositoryBase";

const EditDataView = ({ id, onClose }: EditDataViewProps) => {
  const entity = {
    id: 0,
    code: null,
    name: null,
    active: true,
    duration: null,
    descripion: "",
    level: null,
  };
  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<DegreeTypeModelQuery>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    validate: {
      code: (value: string | null) => {
        if (value === null || value === undefined) {
          return "Vui lòng nhập mã loại văn bằng!";
        }
      },
      name: (value: string | null) => {
        if (value === null || value === undefined) {
          return "Vui lòng nhập tên loại văn bằng!";
        }
      },
      duration: (value: number | null) => {
        if (value === null || value === undefined) {
          return "Vui lòng nhập thời gian học!";
        }
      },
      level: (value: number | null) => {
        if (value === null || value === undefined) {
          return "Vui lòng chọn cấp độ!";
        }
      },
    },
  });

  const callApiGetData = async () => {
    open();
    const url = `${API_ROUTER.DETAIL_DEGREETYPE}?id=${id}`;
    const repo = new DegreeRepository<DegreeTypeModelQuery>();
    const dataApi = await repo.get(url);

    if (dataApi) {
      const result = dataApi?.data;
      if (result != null) {
        form.setValues(result);
        form.resetDirty(result);
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

  const handleEditDegreeType = async (dataSubmit: DegreeTypeModelQuery) => {
    open();
    const url = `${API_ROUTER.UPDATE_DEGREETYPE}`;
    const repo = new DegreeRepository<DegreeTypeModelQuery>();
    const dataApi = await repo.put(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Cập nhật loại văn bằng thành công !",
      });
      modals.closeAll();
    }
    close();
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
      onSubmit={form.onSubmit((e: DegreeTypeModelQuery) => {
        handleEditDegreeType(e);
      })}
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
            label={"Mã loại văn bằng"}
            placeholder={"Nhập mã loại văn bằng"}
            withAsterisk
            {...form.getInputProps("code")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <TextInput
            label={"Tên loại văn bằng"}
            placeholder={"Nhập tên loại văn bằng"}
            withAsterisk
            {...form.getInputProps("name")}
          />
        </Grid.Col>
      </Grid>

      <Grid mt={10}>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <NumberInput
            min={1.5}
            max={7}
            withAsterisk
            decimalScale={1}
            allowDecimal
            label={"Thời gian học"}
            placeholder={"Nhập thời gian học (năm)"}
            hideControls
            value={Number(form.getValues().duration)}
            {...form.getInputProps("duration")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Select
            label={"Cấp độ"}
            placeholder={"Chọn cấp độ"}
            withAsterisk
            data={[
              { value: "0", label: "Đại học" },
              { value: "1", label: "Sau đại học" },
            ]}
            value={form.getValues().level?.toString()}
            {...form.getInputProps("level")}
            onChange={(value) => {
              form.setValues((prev) => ({
                ...prev,
                level: Number(value),
              }));
            }}
          />
        </Grid.Col>
      </Grid>

      <Grid align="center">
        <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
          <Textarea
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
        <Button
          type="submit"
          color={"blue"}
          loading={visible}
          leftSection={!visible ? <IconCheck size={18} /> : undefined}
        >
          Lưu
        </Button>
        <></>
      </Group>
    </Box>
  );
};

export default EditDataView;

type EditDataViewProps = {
  id: string | number;
  onClose: any;
};
