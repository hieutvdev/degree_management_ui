import { Flex, Box } from "@mantine/core";
import NavbarNested from "./navbar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex w={"100%"}>
      <Box w={"17.5%"}>
        <NavbarNested />
      </Box>
      <Box w={"82.5%"} p={10}>
        {children}
      </Box>
    </Flex>
  );
};
export default AdminLayout;
