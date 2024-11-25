import {
  Avatar,
  Divider,
  Flex,
  Group,
  Menu,
  ScrollArea,
  Text,
  rem,
} from "@mantine/core";
import { LinksGroup } from "./NavbarLinksGroup";
import logo from "../../../assets/logo-truong-dai-hoc-dai-nam.jpg";
import classes from "./style/NavbarNested.module.css";
import { router } from "../../../configs/navdata";
import {
  IconLogout,
  IconMail,
  IconMenu,
  IconMenu2,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { NavLink, useNavigate } from "react-router-dom";

export function NavbarNested({ currentState, toggleState }: NavbarNestedProps) {
  const links = router.map((item) => <LinksGroup {...item} key={item.label} />);
  const navigation = useNavigate();

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Flex justify={"space-between"} align={"center"}>
          <Group p={10} justify="center">
            <img
              onClick={() => navigation("/")}
              src={logo}
              style={{ width: rem(50), cursor: "pointer" }}
            />
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
        <Menu trigger="hover" openDelay={100} closeDelay={400} position="right">
          <Menu.Target>
            <Avatar
              key={JSON.parse(localStorage.getItem("user") ?? "").fullName}
              name={JSON.parse(localStorage.getItem("user") ?? "").fullName}
              color="initials"
              radius="xl"
            >
              {JSON.parse(localStorage.getItem("user") ?? "")
                .fullName?.toString()
                .slice(0, 2)
                .toUpperCase()}
            </Avatar>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconUser size={14} color="#f27423" />}>
              <Text fw={500} size="12.5px" c="#f27423">
                {JSON.parse(localStorage.getItem("user") ?? "").fullName}
              </Text>
            </Menu.Item>
            <Menu.Item leftSection={<IconMail size={14} color="#f27423" />}>
              <Text fw={500} size="12.5px" c="#f27423">
                {JSON.parse(localStorage.getItem("user") ?? "").userName}
              </Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
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
