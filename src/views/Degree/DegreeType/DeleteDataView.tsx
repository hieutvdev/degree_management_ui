import { Box, Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { notifications } from "@mantine/notifications";

const DeleteDataView = ({ id, onClose }: DeleteProduct) => {
  const handleDelete = async () => {
    const url = `${API_ROUTER.DELETE_DEGREETYPE}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.delete(url + `?id=${id}`);

    if (dataApi?.isSuccess) {
      onClose((prev: any) => !prev);
      notifications.show({
        color: "green",
        message: "Xóa loại văn bằng thành công !",
      });
      modals.closeAll();
    }
  };

  return (
    <Box size={"auto"}>
      <Text size="20px" mt={5}>
        Bạn có chắc chắn muốn xóa loại văn bằng này ?
      </Text>
      <Group justify="center" mt="lg">
        <Button
          type="button"
          color="gray"
          onClick={() => modals.closeAll()}
          leftSection={<IconX size={18} />}
        >
          Hủy
        </Button>
        <Button
          type="button"
          color="red"
          onClick={() => handleDelete()}
          leftSection={<IconCheck size={18} />}
        >
          Xóa
        </Button>
      </Group>
    </Box>
  );
};

type DeleteProduct = {
  id: any;
  onClose: any;
};

export default DeleteDataView;
