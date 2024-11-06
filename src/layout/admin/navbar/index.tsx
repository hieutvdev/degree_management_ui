import { Avatar, Flex, Group, ScrollArea, Text, rem } from "@mantine/core";
import { LinksGroup } from "./NavbarLinksGroup";
import logo from "../../../assets/logo-truong-dai-hoc-dai-nam.jpg";
import classes from "./style/NavbarNested.module.css";
import { router } from "../../../configs/navdata";
import { IconLogout, IconMenu, IconMenu2, IconX } from "@tabler/icons-react";
import { NavLink, useNavigate } from "react-router-dom";

export function NavbarNested({ currentState, toggleState }: NavbarNestedProps) {
  const links = router.map((item) => <LinksGroup {...item} key={item.label} />);
  const navigation = useNavigate();

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Flex justify={"space-between"} align={"center"}>
          <Group p={10} justify="center">
            <img src={logo} style={{ width: rem(50) }} />
          </Group>
          {currentState ? (
            <IconX
              style={{
                width: rem(20),
                height: rem(20),
              }}
              onClick={toggleState}
            />
          ) : (
            <IconMenu2
              style={{
                width: rem(20),
                height: rem(20),
              }}
              onClick={toggleState}
            />
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <Avatar radius={"lg"} size={40} color="#F27423" />
        <Flex
          align={"center"}
          className={classes.logout}
          gap={"sm"}
          p={"sm"}
          onClick={() => navigation("/login")}
        >
          <Text fw={500} size="14px">
            Đăng xuất
          </Text>
          <IconLogout
            style={{
              width: rem(20),
              height: rem(20),
            }}
            stroke={1.5}
          />
        </Flex>
      </div>
    </nav>
  );
}

type NavbarNestedProps = {
  currentState: boolean;
  toggleState: any;
};

export default NavbarNested;
