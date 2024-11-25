import {
  TextInput,
  Flex,
  Button,
  Badge,
  Tooltip,
  ActionIcon,
  Title,
  Text,
} from "@mantine/core";
import {
  MRT_ColumnDef,
  MRT_RowSelectionState,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import React, { useEffect, useState } from "react";
import { paginationBase } from "../../../interfaces/PaginationResponseBase";
import {
  IconDownload,
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { useHotkeys } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import CreateDataView from "./CreateDataView";
import { DegreeTypeModelQuery } from "../../../interfaces/DegreeType";
import { API_ROUTER } from "../../../constants/api/api_router";
import EditDataView from "./EditDataView";
import DeleteDataView from "./DeleteDataView";
import DetailDataView from "./DetailDataView";
import { mkConfig, generateCsv, download } from "export-to-csv";

const DegreeType = () => {
  //data and fetching state
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [height, setHeight] = useState(0);
  const [pagination, setPagination] = useState(paginationBase);
  //table state
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [selectIds, setSelectIds] = useState<string[]>([]);
  const [deleteViewStatus, setDeleteViewStatus] = useState(false);

  const columns = React.useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "index",
        header: "STT",
        enableColumnActions: false,
        enableColumnFilter: false,
        size: 1,
        Cell: ({ row }) => Number(row.index) + 1,
      },
      {
        accessorKey: "name",
        header: "Tên loại văn bằng",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "code",
        header: "Mã loại văn bằng",
        Cell: ({ renderedCellValue }) => (
          <Badge
            radius="sm"
            variant="dot"
            size="lg"
            color={renderedCellValue === null ? "red" : "green"}
          >
            {renderedCellValue === null ? null : renderedCellValue}
          </Badge>
        ),
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "level",
        header: "Cấp bậc",
        Cell: ({ row }) => (
          <Badge
            color={row.original.level === 0 ? "#09b8ff" : "#fc8c0c"}
            radius={"sm"}
          >
            {row.original.level === 0 ? "Đại học" : "Sau đại học"}
          </Badge>
        ),
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
                onClick={() => handleEdit(row.original.id)}
                variant="light"
                color="orange"
              >
                <IconEdit size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip> */}

            <Tooltip label="Chi tiết">
              <ActionIcon
                onClick={() => handleDetail(row.original.id)}
                variant="light"
                color="cyan"
              >
                <IconEye size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Xóa">
              <ActionIcon
                onClick={() => handleDelete(row.original.id)}
                variant="light"
                color="red"
              >
                <IconTrash size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        ),
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilter: false,
      },
    ],
    []
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
      const url = `${API_ROUTER.GET_LIST_DEGREETYPE}?PageIndex=${pagination.pageIndex}&PageSize=${pagination.pageSize}`;
      const repo = new DegreeRepository<DegreeTypeModelQuery>();
      const dataApi = await repo.getLists(url);
      if (dataApi && dataApi.isSuccess) {
        const result = dataApi?.data;
        if (result) {
          setData(result.data);
          setRowCount(result?.count ?? 0);
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

  const handleCreate = () => {
    modals.openConfirmModal({
      title: <Title order={5}>Tạo mới loại văn bằng</Title>,
      size: "auto",
      children: <CreateDataView onClose={setDeleteViewStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleEdit = (id: number | string) => {
    modals.openConfirmModal({
      title: <Title order={5}>Sửa loại văn bằng</Title>,
      size: "auto",
      children: <EditDataView id={id} onClose={setDeleteViewStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleDetail = (id: number | string) => {
    modals.openConfirmModal({
      title: <Title order={5}>Xem chi tiết loại văn bằng</Title>,
      size: "auto",
      children: <DetailDataView id={id} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleDelete = (id: string | number) => {
    modals.openConfirmModal({
      title: <Title order={5}>Xóa loại văn bằng</Title>,
      size: "auto",
      children: <DeleteDataView onClose={setDeleteViewStatus} id={id} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  useHotkeys([
    [
      "F11",
      () => {
        handleCreate();
      },
    ],
  ]);

  useEffect(() => {
    fetchData();
  }, [deleteViewStatus]);

  useEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const handleResize = () => {
      // 190 là chiều cao của phần phân trang
      // headerHeight là chiều cao của phần header
      setHeight(window.innerHeight - (190 + headerHeight));
    };

    handleResize(); // Set initial height
    window.addEventListener("resize", handleResize); // Update height on window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up event listener
    };
  }, []);

  const table = useMantineReactTable({
    columns: columns,
    data: data,
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: () => (
      <Flex justify={"space-between"} w={"100%"}>
        <Flex gap="md">
          <TextInput placeholder="Nhập từ khóa" />
          <Button leftSection={<IconSearch size={"15px"} />}>Tìm kiếm</Button>
        </Flex>
        <Flex gap="md">
          <Button
            leftSection={<IconPlus size={"15px"} />}
            onClick={() => handleCreate()}
          >
            Thêm mới
          </Button>
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
      columnPinning: {
        left: ["mrt-row-select", "index", "code"],
        right: ["action"],
      },
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

  return <MantineReactTable table={table} />;
};

export default DegreeType;
