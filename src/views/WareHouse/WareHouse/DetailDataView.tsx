import {
  Box,
  Button,
  ComboboxItem,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  ModelDegreeManagementQuery,
  UpdateDegreeManagementModel,
} from "../../../interfaces/DegreeManagement";
import { useForm } from "@mantine/form";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { handleKeyDownNumber } from "../../../helpers/FunctionHelper";
import { IconCheck, IconWindow } from "@tabler/icons-react";

const DetailDataView = ({ id }: DetailDataViewProps) => {
  const entity = {
    id: id,
    stundentId: null,
    degreeTypeId: null,
    code: null,
    regNo: null,
    creditsRequired: null,
    status: 0,
    description: "",
  };

  const [dataStudentSelect, setDataStudentSelect] = useState<ComboboxItem[]>(
    []
  );
  const [dataDegreeTypeSelect, setDataDegreeTypeSelect] = useState<
    ComboboxItem[]
  >([]);
  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<UpdateDegreeManagementModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },
  });

  const callApiGetData = async () => {
    open();
    const url = `${API_ROUTER.DETAIL_DEGREE}?id=${id}`;
    const repo = new DegreeRepository<ModelDegreeManagementQuery>();
    const dataApi = await repo.get(url);

    if (dataApi) {
      const result = dataApi?.data;
      if (result != null) {
        form.setValues(result);
        form.resetDirty(result);
        Promise.all([getSelectStudentGraduated(), getSelectDegreeType()]);
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

  const getSelectStudentGraduated = async () => {
    const url = `${API_ROUTER.GET_SELECT_STUDENT}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataStudentSelect(
        result
          ?.filter((item: any) => item.text != null && item.value != null)
          ?.map((item: any) => ({
            label: item.text,
            value: item.value?.toString(),
          }))
      );
    }
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
        w={{ base: "250px", md: "350px", lg: "500px" }}
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
              label="Số hiệu"
              placeholder="Nhập số hiệu"
              readOnly
              {...form.getInputProps("code")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <NumberInput
              label="Số tín chỉ tích lũy"
              placeholder="Nhập số tín chỉ cần tích lũy"
              key={form.key("creditsRequired")}
              hideControls
              readOnly
              {...form.getInputProps("creditsRequired")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <Select
              label="Sinh viên"
              placeholder="Nhập tên sinh viên"
              data={dataStudentSelect}
              value={
                form.getValues().stundentId
                  ? form.getValues().stundentId?.toString()
                  : null
              }
              {...form.getInputProps("stundentId")}
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <Select
              label="Loại văn bằng"
              placeholder="Chọn loại văn bằng"
              data={dataDegreeTypeSelect}
              value={
                form.getValues().degreeTypeId
                  ? form.getValues().degreeTypeId?.toString()
                  : null
              }
              {...form.getInputProps("degreeTypeId")}
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <TextInput
              label="Số vào sổ"
              placeholder="Nhập số vào sổ"
              {...form.getInputProps("regNo")}
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <Select
              label="Đã cấp văn bằng"
              data={[
                { label: "Chưa cấp văn bằng", value: "0" },
                { label: "Đang cấp văn bằng", value: "1" },
                { label: "Đã cấp văn bằng", value: "2" },
              ]}
              value={form.getValues().status?.toString()}
              {...form.getInputProps("status")}
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Mô tả"
              placeholder="Nhập mô tả"
              {...form.getInputProps("description")}
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
