import { Flex, Box, ScrollArea, rem } from "@mantine/core";
import NavbarNested from "./navbar";
import { useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { transitions } from "@mantine/core/lib/components/Transition/transitions";

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
          justify={"flex-start"}
          h={"50px"}
          style={{
            borderBottom: "1px solid #f0f0f0",
          }}
          p={10}
          align={"center"}
        >
          {openMenu ? (
            <></>
          ) : (
            <IconMenu2
              style={{
                width: rem(20),
                height: rem(20),
              }}
              onClick={() => setOpenMenu(!openMenu)}
            />
          )}
        </Flex>
        <Box p={10}>{children}</Box>
      </Box>
    </Flex>
  );
};
export default AdminLayout;
