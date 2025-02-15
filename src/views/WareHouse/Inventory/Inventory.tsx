import {
  TextInput,
  Flex,
  Button,
  Badge,
  Tooltip,
  ActionIcon,
  Title,
  Text,
  ComboboxItem,
} from "@mantine/core";
import {
  MRT_ColumnDef,
  MRT_RowSelectionState,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import React, { useEffect, useState } from "react";
import {
  IconDownload,
  IconEye,
  IconSearch,
  IconTransferIn,
} from "@tabler/icons-react";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { paginationBase } from "../../../interfaces/PaginationResponseBase";
import { API_ROUTER } from "../../../constants/api/api_router";
import { modals } from "@mantine/modals";
import EditDataView from "./EditDataView";
import DeleteView from "./DeleteDataView";
import DetailDataView from "./DetailDataView";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { ModelInventoryQuery } from "../../../interfaces/Inventory";
import {
  formatDateTransfer,
  getValueById,
} from "../../../helpers/FunctionHelper";
import StockInInventory from "./StockInInventory";

const Inventory = () => {
  //data and fetching state
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [height, setHeight] = useState(0);
  const [pagination, setPagination] = useState(paginationBase);

  const [dataDegreeSelect, setDataDegreeSelect] = useState<ComboboxItem[]>([]);
  const [dataWareHouseSelect, setDataWareHouseSelect] = useState<
    ComboboxItem[]
  >([]);
  //table state
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [selectIds, setSelectIds] = useState<string[]>([]);
  const [deleteViewStatus, setDeleteViewStatus] = useState(false);

  const columns = React.useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "stt",
        header: "STT",
        Cell: ({ row }) => (
          <Text fw={500} size="12.5px">
            {row.index === -1 ? "" : row.index + 1}
          </Text>
        ),
        size: 50,
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "warehouseCode",
        header: "Mã kho",
        Cell: ({ renderedCellValue }) => (
          <Badge
            radius="sm"
            variant="dot"
            size="lg"
            color={renderedCellValue === null ? "red" : "green"}
            w={175}
          >
            {renderedCellValue}
          </Badge>
        ),
        size: 175,
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "warehouseName",
        header: "Tên kho",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "degreeTypeCode",
        header: "Mã loại văn bằng",
        Cell: ({ renderedCellValue }) => (
          <Badge
            radius="sm"
            variant="dot"
            size="lg"
            color={renderedCellValue === null ? "red" : "green"}
          >
            {renderedCellValue}
          </Badge>
        ),
        size: 200,
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "degreeTypeName",
        header: "Loại văn bằng",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "quantity",
        header: "Số lượng",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "description",
        header: "Ghi chú",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "action",
        header: "Thao tác",
        size: 10,
        Cell: ({ row }) => (
          <Flex gap={"md"} align={"center"}>
            {/* <Tooltip label="Chỉnh sửa">
              <ActionIcon
                variant="light"
                color="orange"
                onClick={() => handleUpdate(row.original.id)}
              >
                <IconEdit size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip> */}

            <Tooltip label="Chi tiết">
              <ActionIcon
                variant="light"
                color="cyan"
                onClick={() => handleDetail(row.original.id)}
              >
                <IconEye size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            {/* <Tooltip label="Xóa">
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => handleDelete(row.original.id)}
              >
                <IconTrash size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip> */}
          </Flex>
        ),
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilter: false,
      },
    ],
    [dataDegreeSelect, dataWareHouseSelect]
  );

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  // const handleExportRows = (rows: MRT_Row<any>[]) => {
  //   const rowData = rows.map((row) => row.original);
  //   const csv = generateCsv(csvConfig)(rowData);
  //   download(csvConfig)(csv);
  // };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  async function fetchData() {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const url = `${API_ROUTER.GET_LIST_INVENTORY}?PageIndex=${pagination.pageIndex}&PageSize=${pagination.pageSize}`;
      const repo = new DegreeRepository<ModelInventoryQuery>();
      const dataApi = await repo.getLists(url);
      if (dataApi && dataApi.isSuccess) {
        const result = dataApi?.data;
        if (result) {
          setData(result.data);
          setRowCount(result?.count ?? 0);
          Promise.all([getSelectDegree(), getSelectWareHouse()]);
        } else {
          setData([]);
          setRowCount(0);
        }
        setSelectIds([]);
        table.resetRowSelection();
        setIsLoading(false);
        setIsRefetching(false);
      }
    } catch (error) {
      console.error("Error fetching student list:", error);
    }
  }

  const getSelectDegree = async () => {
    const url = `${API_ROUTER.GET_SELECT_DEGREE}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataDegreeSelect(
        result
          ?.filter((item: any) => item.text != null && item.value != null)
          ?.map((item: any) => ({
            label: item.text,
            value: item.value?.toString(),
          }))
      );
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

  const handleStockIn = () => {
    modals.openConfirmModal({
      title: <Title order={5}>Nhập kho</Title>,
      size: "auto",
      children: <StockInInventory onClose={setDeleteViewStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleUpdate = (id: string | number) => {
    modals.openConfirmModal({
      title: <Title order={5}>Chỉnh sửa kho lưu tồn văn bằng</Title>,
      size: "auto",
      children: <EditDataView id={id} onClose={setDeleteViewStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleDetail = (id: string | number) => {
    modals.openConfirmModal({
      title: <Title order={5}>Chi tiết phôi văn bằng</Title>,
      size: "auto",
      children: <DetailDataView id={id} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleDelete = (id: string | number) => {
    modals.openConfirmModal({
      title: <Title order={5}>Xóa kho lưu tồn văn bằng</Title>,
      size: "auto",
      children: <DeleteView id={id} onClose={setDeleteViewStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  useEffect(() => {
    fetchData();
  }, [deleteViewStatus]);

  useEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const handleResize = () => {
      setHeight(window.innerHeight - (190 + headerHeight));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const table = useMantineReactTable({
    columns,
    data,
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: () => (
      <Flex justify={"space-between"} w={"100%"}>
        <Flex gap="md">
          <TextInput placeholder="Nhập từ khóa" />
          <Button leftSection={<IconSearch size={"15px"} />}>Tìm kiếm</Button>
        </Flex>
        <Flex gap="md">
          <Button
            onClick={handleExportData}
            leftSection={<IconDownload size={"15px"} />}
          >
            Export Data
          </Button>
        </Flex>
      </Flex>
    ),
    renderToolbarInternalActions: () => <></>,
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
      style: { maxHeight: height, minHeight: height },
    },
    enableStickyHeader: true,
    onRowSelectionChange: setRowSelection,
    manualFiltering: false,
    manualPagination: true,
    manualSorting: false,
    rowCount,
    onPaginationChange: setPagination,
    mantineTableBodyCellProps: () => ({
      style: {
        fontWeight: "500",
        fontSize: "12.5px",
        padding: "5px 15px",
      },
    }),
    state: {
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      showSkeletons: isLoading,
      rowSelection,
    },
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

  return (
    <>
      <MantineReactTable table={table} />
    </>
  );
};

export default Inventory;
