import { Box, Flex, Table, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

const DetailDataView = () => {
  return (
    <Box mt={10} w={"80vw"} maw={1000}>
      <DatePickerInput
        label="Ngày xuất kho phôi cấp văn bằng"
        value={new Date()}
        valueFormat="DD-MM-YYYY"
        variant="filled"
        readOnly
      />
      <Table striped highlightOnHover withTableBorder withColumnBorders mt={10}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th rowSpan={2} ta={"center"}>
              STT
            </Table.Th>
            <Table.Th rowSpan={2} ta={"center"}>
              Ngày xuất kho
            </Table.Th>
            <Table.Th rowSpan={2} ta={"center"}>
              Trình độ/Hình thức đào tạo
            </Table.Th>
            <Table.Th rowSpan={2} ta={"center"}>
              Loại phôi
            </Table.Th>
            <Table.Th rowSpan={2} ta={"center"}>
              Số lượng phôi
            </Table.Th>
            <Table.Th colSpan={2} ta={"center"}>
              Số Seri phôi
            </Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th ta={"center"}>Số bắt đầu</Table.Th>
            <Table.Th ta={"center"}>Số kết thúc</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td ta={"center"}>1</Table.Td>
            <Table.Td ta={"center"}>24-11-2024</Table.Td>
            <Table.Td ta={"center"}>Ths</Table.Td>
            <Table.Td ta={"center"}>Thạc sĩ</Table.Td>
            <Table.Td ta={"center"}>24</Table.Td>
            <Table.Td ta={"center"}>000169</Table.Td>
            <Table.Td ta={"center"}>000192</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td colSpan={3} ta={"center"}>
              Cộng
            </Table.Td>
            <Table.Td></Table.Td>
            <Table.Td colSpan={3} ta={"center"}>
              400
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Flex gap={"sm"} mt={10}>
        <Text>
          Tổng cộng {"("}viết bằng chữ{")"} :{" "}
        </Text>
        <Text>Bốn trăm</Text>
      </Flex>
    </Box>
  );
};

export default DetailDataView;
