import { Flex, Box, Text, rem, Avatar, Menu } from "@mantine/core";
import NavbarNested from "./navbar";
import { useState } from "react";
import { IconBellRinging, IconMenu2 } from "@tabler/icons-react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  return (
    <Flex
      w={"100%"}
      style={{
        position: "relative",
      }}
    >
      <Box
        w={"17.5%"}
        display={openMenu ? "block" : "none"}
        style={{
          transition: "width 0.1s ease-out",
        }}
      >
        <NavbarNested
          currentState={openMenu}
          toggleState={() => setOpenMenu(!openMenu)}
        />
      </Box>

      <Box
        w={openMenu ? "82.5%" : "100%"}
        style={{
          maxHeight: "100vh",
          overflowY: "auto",
          transition: "width 0.1s ease-out",
        }}
      >
        <Flex
          justify={"space-between"}
          h={"50px"}
          style={{
            borderBottom: "1px solid #f0f0f0",
          }}
          p={10}
          align={"center"}
        >
          {openMenu ? (
            <Box></Box>
          ) : (
            <IconMenu2
              style={{
                width: rem(20),
                height: rem(20),
              }}
              onClick={() => setOpenMenu(!openMenu)}
            />
          )}
          <Menu>
            <Menu.Target>
              <Avatar color="cyan" radius="xl" style={{ cursor: "pointer" }}>
                <IconBellRinging />
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Flex align={"center"} justify={"center"}>
                <Text>Không có thông báo !</Text>
              </Flex>
            </Menu.Dropdown>
          </Menu>
        </Flex>
        <Box p={10}>{children}</Box>
      </Box>
    </Flex>
  );
};
export default AdminLayout;
