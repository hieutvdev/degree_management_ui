import { Avatar, Flex, Group, ScrollArea, Text, rem } from "@mantine/core";
import { LinksGroup } from "./NavbarLinksGroup";
import logo from "../../../assets/logo-truong-dai-hoc-dai-nam.jpg";
import classes from "./style/NavbarNested.module.css";
import { router } from "../../../configs/navdata";
import { IconLogout } from "@tabler/icons-react";

export function NavbarNested() {
  const links = router.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group p={10}>
          <img src={logo} style={{ width: rem(50) }} />
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <Avatar radius={"lg"} size={40} color="#F27423" />
        <Flex align={"center"} className={classes.logout} gap={"sm"} p={"sm"}>
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

export default NavbarNested;
