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
  Menu,
  Box,
} from "@mantine/core";
import {
  MRT_ColumnDef,
  MRT_RowSelectionState,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import React, { useEffect, useState } from "react";
import {
  IconCheck,
  IconDownload,
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconStatusChange,
  IconTransferIn,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { paginationBase } from "../../../interfaces/PaginationResponseBase";
import { API_ROUTER } from "../../../constants/api/api_router";
import { modals } from "@mantine/modals";
import CreateDataView from "./CreateDataView";
import EditDataView from "./EditDataView";
import DeleteView from "./DeleteDataView";
import DetailDataView from "./DetailDataView";
import { ModelWareHouseQuery } from "../../../interfaces/WareHouse";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { notifications } from "@mantine/notifications";

const InWard = () => {
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
        header: "STT",
        Cell: ({ row }) => (
          <Text fw={500} size="12.5px">
            {row.index === -1 ? "" : row.index + 1}
          </Text>
        ),
        enableColumnActions: false,
      },
      {
        accessorKey: "code",
        header: "Mã nhập kho",
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
        accessorKey: "warehouseName",
        header: "Tên kho",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        Cell: ({ renderedCellValue }) => (
          <Badge
            color={
              renderedCellValue === 1
                ? "yellow"
                : renderedCellValue === 2
                ? "red"
                : "green"
            }
            radius={"sm"}
          >
            {renderedCellValue === 1
              ? "Chờ duyệt"
              : renderedCellValue === 2
              ? "Từ chối"
              : "Đã duyệt"}
          </Badge>
        ),
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "note",
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
            <Menu>
              <Menu.Target>
                <ActionIcon
                  variant="light"
                  color="teal"
                  disabled={row.original.status !== 1}
                >
                  <IconStatusChange size={20} stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Flex direction={"column"} gap={"xs"}>
                  <Button
                    variant="outline"
                    leftSection={<IconCheck size={"14px"} />}
                    color="teal"
                    onClick={() => modalApprove(true, row.original.id)}
                  >
                    Duyệt
                  </Button>
                  <Button
                    variant="outline"
                    leftSection={<IconX size={"14px"} />}
                    color="red"
                    onClick={() => modalApprove(false, row.original.id)}
                  >
                    Từ chối
                  </Button>
                </Flex>
              </Menu.Dropdown>
            </Menu>
            <Tooltip label="Chi tiết">
              <ActionIcon
                variant="light"
                color="cyan"
                onClick={() => handleDetail(row.original.id)}
              >
                <IconEye size={20} stroke={1.5} />
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
      const url = `${API_ROUTER.GET_LIST_INWARD}?PageIndex=${pagination.pageIndex}&PageSize=${pagination.pageSize}`;
      const repo = new DegreeRepository<ModelWareHouseQuery>();
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

  const handleApprove = async (isApproved: boolean, id: number | string) => {
    const url = `${API_ROUTER.APPROVE_INWARD}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.post(url, {
      stockInInvId: id,
      isApproved: isApproved,
    });

    if (dataApi && dataApi?.isSuccess) {
      notifications.show({
        color: "green",
        message: "Xác nhận trạng thái thành công !",
      });
      modals.closeAll();
      fetchData();
    }
  };

  const handleCreate = () => {
    modals.openConfirmModal({
      title: <Title order={5}>Nhập kho văn bằng</Title>,
      size: "auto",
      children: <CreateDataView onClose={setDeleteViewStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleUpdate = (id: string | number) => {
    modals.openConfirmModal({
      title: <Title order={5}>Chỉnh sửa nhập kho văn bằng</Title>,
      size: "auto",
      children: <EditDataView id={id} onClose={setDeleteViewStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleDetail = (id: string | number) => {
    modals.openConfirmModal({
      title: <Title order={5}>Chi tiết nhập kho văn bằng</Title>,
      size: "auto",
      children: <DetailDataView id={id} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleDelete = (id: string | number) => {
    modals.openConfirmModal({
      title: <Title order={5}>Xóa nhập kho văn bằng</Title>,
      size: "auto",
      children: <DeleteView id={id} onClose={setDeleteViewStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const modalApprove = (isApproved: boolean, id: number | null) => {
    modals.openConfirmModal({
      title: <Title order={5}>Xác nhận nhập kho</Title>,
      size: "auto",
      children: (
        <Box mt={15}>
          <Text fw={500} size="20px">
            {isApproved
              ? "Bạn có chắc muốn duyệt lần nhập kho này ?"
              : "Bạn có chắc muốn từ chối lần nhập kho này ?"}
          </Text>
          <Flex justify={"end"} mt={15}>
            <Button
              variant="outline"
              leftSection={<IconCheck size={"14px"} />}
              onClick={() => handleApprove(isApproved, Number(id))}
            >
              Xác nhận
            </Button>
          </Flex>
        </Box>
      ),
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
            leftSection={<IconTransferIn size={"15px"} />}
            onClick={() => handleCreate()}
          >
            Nhập kho
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

export default InWard;
