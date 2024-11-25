import { useEffect, useState } from "react";
import { API_URL } from "../../../constants/api";
import { API_ROUTER } from "../../../constants/api/api_router";
import {
  Avatar,
  Box,
  Grid,
  Table,
  Text,
  Checkbox,
  Button,
  Flex,
  Notification,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

const AssignRole = ({ userId }: AssignRoleProps) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleGetUser = async () => {
    try {
      const res = await fetch(
        `${API_URL}${API_ROUTER.GET_DETAIL_USER}${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data);

      if (data.isSuccess) {
        setUser(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetRole = async () => {
    try {
      const res = await fetch(`${API_URL}${API_ROUTER.GET_SELECT_ROLE}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);

      if (data.isSuccess) {
        setRoles(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAssignRole = async () => {
    try {
      const res = await fetch(`${API_URL}${API_ROUTER.ASSIGN_ROLE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          roleNames: selectedRoles,
        }),
      });
      const data = await res.json();
      console.log(data);

      if (data.isSuccess) {
        Notifications.show({
          title: "Gán vai trò thành công",
          message: "Gán vai trò thành công",
          color: "teal",
        });
        modals.closeAll();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoleChange = (roleName: string) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(roleName)
        ? prevSelectedRoles.filter((name) => name !== roleName)
        : [...prevSelectedRoles, roleName]
    );
  };

  useEffect(() => {
    handleGetUser();
    handleGetRole();
  }, []);

  return (
    <Grid w={"600px"}>
      <Grid.Col
        span={4}
        style={{
          borderRight: "1px solid #e0e0e0",
        }}
        mih={"300px"}
        p={20}
      >
        <Box>
          <Flex justify={"center"}>
            <Avatar src={user.avatar} size={50} radius={"50%"} alt="avatar" />
          </Flex>
          <Flex justify={"center"}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginLeft: 10,
              }}
            >
              {user.fullName}
            </Text>
          </Flex>
        </Box>
      </Grid.Col>
      <Grid.Col span={8} p={20}>
        <Box>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Danh sách vai trò
          </Text>
          <Table>
            <thead>
              <tr
                style={{
                  backgroundColor: "#f5f5f5",
                }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  Tên vai trò
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  Chọn
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.text}>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    {role.text}
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Checkbox
                      checked={selectedRoles.includes(role.text)}
                      onChange={() => handleRoleChange(role.text)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button
            onClick={handleAssignRole}
            style={{
              marginTop: 20,
            }}
          >
            Gán vai trò
          </Button>
        </Box>
      </Grid.Col>
    </Grid>
  );
};

type AssignRoleProps = {
  userId: string;
};
export default AssignRole;
