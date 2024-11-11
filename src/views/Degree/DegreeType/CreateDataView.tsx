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
import { IconCheck, IconX } from "@tabler/icons-react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { CreateDegreeTypeModel } from "../../../interfaces/DegreeType";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { useEffect, useState } from "react";

const CreateDataView = ({ onClose }: CreateDataViewProps) => {
  const entity = {
    code: null,
    name: null,
    active: false,
    duration: null,
    level: null,
    specializationId: null,
    description: null,
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const [dataSpecializationSelect, setDataSpecializationSelect] = useState<
    ComboboxItem[]
  >([]);

  const form = useForm<CreateDegreeTypeModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    transformValues: (values) => ({
      ...values,
      specializationId: Number(values.specializationId),
    }),

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
      specializationId: (value: number | null) => {
        if (!value) {
          return "Vui lòng chọn chuyên ngành !";
        }
      },
    },
  });

  const handleCreateDegreeType = async (dataSubmit: CreateDegreeTypeModel) => {
    open();
    const url = `${API_ROUTER.CREATE_DEGREETYPE}`;
    const repo = new DegreeRepository<CreateDegreeTypeModel>();
    const dataApi = await repo.post(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Thêm loại văn bằng thành công !",
      });
      modals.closeAll();
    }
    close();
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
    Promise.all([getSelectSpecialization()]);
  }, []);

  return (
    <>
      <Box
        component="form"
        mx="auto"
        w={{ base: "250px", md: "300px", lg: "400px" }}
        onSubmit={form.onSubmit((e: CreateDegreeTypeModel) => {
          handleCreateDegreeType(e);
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

        <Grid>
          <Grid.Col span={12}>
            <Select
              label="Chuyên ngành"
              placeholder="Nhập tên chuyên ngành"
              data={dataSpecializationSelect}
              searchable
              clearable
              nothingFoundMessage="Không tìm thấy chuyên ngành !"
              {...form.getInputProps("specializationId")}
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
    </>
  );
};

export default CreateDataView;

type CreateDataViewProps = {
  onClose: any;
};
