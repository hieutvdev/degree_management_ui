import { Box, Button, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconWindow } from "@tabler/icons-react";

const CreateDataView = () => {
  const [visible] = useDisclosure(false);

  return (
    <Box>
      <Text>Tạo mới chuyên ngành</Text>
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
          color={"cyan"}
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

export default CreateDataView;
