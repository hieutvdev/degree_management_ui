import { Box, Divider, Flex, Table, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

const DetailDataView = () => {
  return (
    <Box mt={10} w={"80vw"} maw={1000}>
      <DatePickerInput
        label="Ngày tạo phiếu"
        value={new Date()}
        valueFormat="DD-MM-YYYY"
        variant="filled"
        readOnly
      />
      <Divider mt={10} label="Kết quả tốt nghiệp" labelPosition="center" />
      <Table striped highlightOnHover withTableBorder withColumnBorders mt={10}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th ta={"center"}>STT</Table.Th>
            <Table.Th ta={"center"}>Chuyên ngành đào tạo</Table.Th>
            <Table.Th ta={"center"}>Khóa học</Table.Th>
            <Table.Th ta={"center"}>Sinh viên tốt nghiệp</Table.Th>
            <Table.Th ta={"center"}>Ghi chú</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td ta={"center"}>1</Table.Td>
            <Table.Td ta={"center"}>Quản lý kinh tế</Table.Td>
            <Table.Td ta={"center"}>5</Table.Td>
            <Table.Td ta={"center"}>200</Table.Td>
            <Table.Td ta={"center"}></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td ta={"center"}>2</Table.Td>
            <Table.Td ta={"center"}>Tài chính ngân hàng</Table.Td>
            <Table.Td ta={"center"}>4</Table.Td>
            <Table.Td ta={"center"}>200</Table.Td>
            <Table.Td ta={"center"}></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td colSpan={3} ta={"center"}>
              Cộng
            </Table.Td>
            <Table.Td ta={"center"}>400</Table.Td>
            <Table.Td></Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Divider
        mt={10}
        label="Số lượng phôi đề nghị cấp"
        labelPosition="center"
      />
      <Table striped highlightOnHover withTableBorder withColumnBorders mt={10}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th ta={"center"}>STT</Table.Th>
            <Table.Th ta={"center"}>Loại bằng</Table.Th>
            <Table.Th ta={"center"}>
              Số lượng SV theo Quyết định tốt nghiệp
            </Table.Th>
            <Table.Th ta={"center"}>Số lượng đề nghị</Table.Th>
            <Table.Th ta={"center"}>Ghi chú</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td ta={"center"}>1</Table.Td>
            <Table.Td ta={"center"}>Thạc sĩ</Table.Td>
            <Table.Td ta={"center"}>24</Table.Td>
            <Table.Td ta={"center"}>24</Table.Td>
            <Table.Td ta={"center"}></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td ta={"center"}></Table.Td>
            <Table.Td ta={"center"}>Cộng</Table.Td>
            <Table.Td ta={"center"}>24</Table.Td>
            <Table.Td ta={"center"}>24</Table.Td>
            <Table.Td ta={"center"}></Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default DetailDataView;
