import { Box, Button, ComboboxItem, Group, MultiSelect } from "@mantine/core";
import { useForm } from "@mantine/form";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

const DegreeType = ({ id, onClose }: { id: any; onClose: any }) => {
  const entity = {
    majorId: id,
    degreeTypeIds: [],
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const [dataDegreeType, setDataDegreeType] = useState<ComboboxItem[]>([]);

  const form = useForm<any>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    transformValues: (values) => ({
      ...values,
      degreeTypeIds: values.degreeTypeIds.map(Number),
    }),
  });

  const handleUpdateDegreeType = async (dataSubmit: any) => {
    open();
    const url = `${API_ROUTER.UPDATE_DEGREE_TYPE}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.put(url, dataSubmit);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Xét loại văn bằng thành công !",
      });
      modals.closeAll();
    }
    close();
  };

  const getSelectDegreeType = async () => {
    const url = `${API_ROUTER.GET_SELECT_DEGREETYPE}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataDegreeType(
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
    getSelectDegreeType();
  }, []);

  return (
    <Box
      component="form"
      mx="auto"
      w={{ base: "250px", md: "350px", lg: "500px" }}
      onSubmit={form.onSubmit((e: any) => {
        handleUpdateDegreeType(e);
      })}
    >
      <MultiSelect
        label="Loại văn bằng"
        placeholder="Nhập loại văn bằng"
        data={dataDegreeType}
        searchable
        clearable
        nothingFoundMessage="Không tìm thấy loại văn bằng !"
        onChange={(e) => {
          form.setValues((prev) => ({
            ...prev,
            degreeTypeIds: e,
          }));
        }}
      />
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
          type="submit"
          loading={visible}
          leftSection={!visible ? <IconCheck size={18} /> : undefined}
        >
          Lưu
        </Button>
      </Group>
    </Box>
  );
};

export default DegreeType;
