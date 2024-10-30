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
        <Group justify="center">
          <img src={logo} style={{ width: rem(50) }} />
          <Text fw={"bold"} c={"#F27423"} size="18px">
            Quản lý văn bằng
          </Text>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <Avatar radius={"xl"} color="#F27423" />
        <Flex align={"center"} className={classes.logout} gap={"sm"} p={"sm"}>
          <Text fw={500} size="12px">
            Đăng xuất
          </Text>
          <IconLogout
            style={{
              width: rem(16),
              height: rem(16),
            }}
            stroke={1.5}
          />
        </Flex>
      </div>
    </nav>
  );
}
