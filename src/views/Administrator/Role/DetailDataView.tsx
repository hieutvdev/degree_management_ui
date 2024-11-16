import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { modals } from "@mantine/modals";
import { useEffect } from "react";
import { Box, Grid, LoadingOverlay, Textarea, TextInput } from "@mantine/core";

const DetailDataView = ({ id }: DetailDataViewProps) => {
  const entity = {
    id: id,
    name: null,
    description: "",
    status: 0,
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<any>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },
  });

  const getDataDetail = async () => {
    const url = `${API_ROUTER.GET_DETAIL_ROLE}`;
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
        <Grid.Col span={12}>
          <TextInput
            label="Tên chức danh"
            placeholder="Nhập tên chức danh"
            variant="filled"
            readOnly
            {...form.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            label="Ghi chú"
            placeholder="Nhập ghi chú"
            variant="filled"
            readOnly
            {...form.getInputProps("description")}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default DetailDataView;

type DetailDataViewProps = {
  id: any;
};
