import {
  Box,
  Button,
  Checkbox,
  ComboboxItem,
  Grid,
  Group,
  LoadingOverlay,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { modals } from "@mantine/modals";
import { IconWindow } from "@tabler/icons-react";
import { ModelWareHouseQuery } from "../../../interfaces/WareHouse";

const DetailDataView = ({ id }: DetailDataViewProps) => {
  const entity = {
    id: 0,
    name: null,
    code: null,
    active: false,
    description: "",
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<ModelWareHouseQuery>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },
  });

  const getDataDetail = async () => {
    const url = `${API_ROUTER.DETAIL_WAREHOUSE}`;
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
        style={{ position: "relative" }}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Grid mt={10}>
          <Grid.Col span={{ base: 12, md: 6, lg: 4.5 }}>
            <TextInput
              label={"Mã kho văn bằng"}
              placeholder={"Nhập mã kho văn bằng"}
              readOnly
              {...form.getInputProps("code")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 7.5 }}>
            <TextInput
              label={"Tên kho văn bằng"}
              placeholder={"Nhập tên kho văn bằng"}
              readOnly
              {...form.getInputProps("name")}
            />
          </Grid.Col>
        </Grid>

        <Grid align="center">
          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
            <Textarea
              label={"Ghi chú"}
              placeholder="Nhập ghi chú"
              readOnly
              {...form.getInputProps("description")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
            <Checkbox
              label={"Sử dụng"}
              checked={form.getValues().active}
              readOnly
              {...form.getInputProps("active")}
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
