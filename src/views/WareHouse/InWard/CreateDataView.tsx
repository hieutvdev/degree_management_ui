import {
  ActionIcon,
  Box,
  ComboboxItem,
  Grid,
  Select,
  TextInput,
  Tooltip,
  Text,
  Badge,
  Flex,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  CreateInwardModel,
  StockInInvSuggestDetail,
} from "../../../interfaces/Inward";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { useEffect, useState } from "react";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import React from "react";

const CreateDataView = ({ onClose }: { onClose: any }) => {
  const entity = {
    warehouseId: null,
    requestPersonId: null,
    code: null,
    stockInInvSuggestDetails: null,
    status: null,
    note: null,
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const [stockInInvSuggestDetails, setStockInInvSuggestDetails] = useState<
    StockInInvSuggestDetail[]
  >([]);

  const [dataWareHouseSelect, setDataWareHouseSelect] = useState<
    ComboboxItem[]
  >([]);

  const form = useForm<CreateInwardModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    validate: {},
  });

  const columns = React.useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "degreeTypeId",
        header: "Loại văn bằng",
        enableColumnActions: false,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        accessorKey: "quantity",
        header: "Số lượng",
        enableColumnActions: false,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        accessorKey: "action",
        header: "Thao tác",
        size: 10,
        Cell: ({ row }) => (
          <Tooltip label="Xóa">
            <ActionIcon variant="light" color="red">
              <IconTrash size={20} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        ),
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilter: false,
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: stockInInvSuggestDetails,
    positionToolbarAlertBanner: "bottom",
    enableTopToolbar: false,
    enableBottomToolbar: false,
    mantineTopToolbarProps: {
      style: {
        borderBottom: "3px solid rgba(128, 128, 128, 0.5)",
        marginBottom: 5,
      },
    },
    getRowId: (row) => row.id?.toString(),
    initialState: {
      showColumnFilters: false,
      columnVisibility: { id: false },
      density: "xs",
    },
    mantineTableContainerProps: {
      style: { maxHeight: 350, minHeight: 350 },
    },
    enableStickyHeader: true,
    manualFiltering: false,
    manualPagination: true,
    manualSorting: false,
    mantineTableBodyCellProps: () => ({
      style: {
        fontWeight: "500",
        fontSize: "12.5px",
        padding: "5px 15px",
      },
    }),
    state: {},
    mantineToolbarAlertBannerProps: false
      ? { color: "red", children: "Lỗi tải dữ liệu !" }
      : undefined,
    mantinePaginationProps: {
      showRowsPerPage: true,
      withEdges: true,
      rowsPerPageOptions: ["20", "50", "100"],
    },
    paginationDisplayMode: "pages",
    enableColumnPinning: true,
    mantineTableProps: {
      striped: false,
    },
    columnFilterDisplayMode: "popover",
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: { cursor: "pointer" },
    }),
  });

  const getCreateInward = async () => {
    const url = `${API_ROUTER.GET_CREATE_INWARD}`;
    const repo = new DegreeRepository<CreateInwardModel>();
    const dataApi = await repo.get(`${url}?prefix=NKVB`);

    if (dataApi?.isSuccess) {
      const result = dataApi.data;
      form.setValues(result ?? {});
      Promise.all([getSelectWareHouse()]);
    }
  };

  const getSelectWareHouse = async () => {
    const url = `${API_ROUTER.GET_SELECT_WAREHOUSE}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataWareHouseSelect(
        result
          ?.filter((item: any) => item.text != null && item.value != null)
          ?.map((item: any) => ({
            label: item.text,
            value: item.value?.toString(),
          }))
      );
    }
  };

  useEffect(() => {
    getCreateInward();
  }, []);

  return (
    <Box maw={800} w={"50vw"}>
      <Grid mt={10}>
        <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
          <MantineReactTable table={table} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
          <Button
            variant="outline"
            color="blue"
            leftSection={<IconPlus size={"14px"} />}
            w={"100%"}
            onClick={() =>
              setStockInInvSuggestDetails((prev) => [
                ...prev,
                {
                  id: 0,
                  stockInInvSuggestId: 0,
                  degreeTypeId: 0,
                  quantity: 0,
                },
              ])
            }
          >
            Thêm phôi văn bằng
          </Button>
          <TextInput
            label="Mã nhập kho"
            placeholder="Mã nhập kho"
            value={form.getValues().code ?? ""}
            variant="filled"
            readOnly
          />
          <Select
            label="Kho"
            placeholder="Nhập tên kho"
            data={dataWareHouseSelect}
            searchable
            clearable
            nothingFoundMessage="Không tìm thấy kho !"
          />
          <Button
            variant="outline"
            color="teal"
            leftSection={<IconCheck size={"14px"} />}
            mt={15}
            w={"100%"}
          >
            Lưu
          </Button>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default CreateDataView;
