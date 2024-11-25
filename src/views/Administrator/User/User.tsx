import {
  TextInput,
  Flex,
  Button,
  Text,
  Title,
  Avatar,
  Badge,
  Tooltip,
  ActionIcon,
  Notification,
} from "@mantine/core";
import {
  MRT_ColumnDef,
  MRT_RowSelectionState,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import React, { useEffect, useState } from "react";
import {
  IconEdit,
  IconEye,
  IconHandClick,
  IconHandOff,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUserCheck,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { paginationBase } from "../../../interfaces/PaginationResponseBase";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { API_ROUTER } from "../../../constants/api/api_router";
import { mkConfig } from "export-to-csv";
import { stat } from "fs";
import { API_URL } from "../../../constants/api";
import { Notifications } from "@mantine/notifications";
import AssignRole from "./AssignRole";

const User = () => {
  //data and fetching state
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [dataReview, setDataReview] = useState<any[]>([]);
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
  //keySearch
  const [keySearch, setKeySearch] = useState("");

  const handleAssignRole = async (userId: string) => {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Gán quyền cho người dùng</Title>
        </>
      ),
      size: "auto",
      children: <AssignRole userId={userId} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleActiveUser = async (userId: string) => {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>
            Bạn có chắc chắn muốn phê duyệt tài khoản này ?
          </Title>
        </>
      ),
      confirmProps: {
        onClick: async () => {
          try {
            const res = await fetch(`${API_URL}${API_ROUTER.ACTIVE_USER}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: userId }),
            });
            var data = await res.json();
            console.log(data);

            if (data.isSuccess) {
              await fetchData();
              Notifications.show({
                title: "Thành công",
                message: "Thay đổi trạng thái người dùng thành công",
                color: "green",
              });
            } else {
              Notifications.show({
                title: "Lỗi",
                message: "Có lỗi xảy ra khi thay đổi trạng thái người dùng",
                color: "red",
              });
            }
          } catch (error) {
            Notifications.show({
              title: "Lỗi",
              message: "Có lỗi xảy ra khi thay đổi trạng thái người dùng",
              color: "red",
            });
          }
        },
        content: "Xác nhận",
      },
    });
  };

  const handleBanUser = async (userId: string) => {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Bạn có chắc chắn muốn khóa tài khoản này ?</Title>
        </>
      ),
      confirmProps: {
        onClick: async () => {
          try {
            const res = await fetch(`${API_URL}${API_ROUTER.BAN_USER}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: userId }),
            });
            var data = await res.json();
            console.log(data);

            if (data.isSuccess) {
              await fetchData();
              Notifications.show({
                title: "Thành công",
                message: "Thay đổi trạng thái người dùng thành công",
                color: "green",
              });
            } else {
              Notifications.show({
                title: "Lỗi",
                message: "Có lỗi xảy ra khi thay đổi trạng thái người dùng",
                color: "red",
              });
            }
          } catch (error) {
            Notifications.show({
              title: "Lỗi",
              message: "Có lỗi xảy ra khi thay đổi trạng thái người dùng",
              color: "red",
            });
          }
        },
        content: "Khóa tài khoản",
      },
      cancelProps: { display: "none" },
    });
  };
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
        accessorKey: "fullName",
        header: "Họ và tên",
        Cell: ({ row }) => (
          <Flex align={"center"} gap={"md"}>
            <Avatar
              key={row.original.fullName}
              name={row.original.fullName}
              color="initials"
              radius="xl"
            >
              {row.original.fullName?.toString().slice(0, 2).toUpperCase()}
            </Avatar>
            <Text fw={500} size="12.5px">
              {row.original.fullName}
            </Text>
          </Flex>
        ),
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "userName",
        header: "Tên tài khoản",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "email",
        header: "Email",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        Cell: ({ row }) => (
          <Badge
            color={row.original.status === 2 ? "green" : "red"}
            radius={"sm"}
            variant="light"
          >
            {row.original.status === 2
              ? "Được phép truy cập"
              : "Không được phép truy cập"}
          </Badge>
        ),
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "action",
        header: "Thao tác",
        size: 10,
        Cell: ({ row }) => (
          <Flex gap={"md"} align={"center"}>
            <Tooltip label="Chấp thuận đăng nhập">
              <ActionIcon
                onClick={async () => {
                  await handleActiveUser(row.original.id);
                }}
                variant="light"
                color="green"
              >
                <IconHandClick size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Khóa tài khoản">
              <ActionIcon
                onClick={async () => {
                  await handleBanUser(row.original.id);
                }}
                variant="light"
                color="red"
              >
                <IconHandOff size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Gán quyền">
              <ActionIcon
                onClick={async () => {
                  await handleAssignRole(row.original.id);
                }}
                variant="light"
                color="orange"
              >
                <IconUserCheck size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Chi tiết">
              <ActionIcon variant="light" color="cyan">
                <IconEye size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Xóa">
              <ActionIcon variant="light" color="red">
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

  function reviewDataImport() {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xem lại danh sách khoa !</Title>
        </>
      ),
      size: "auto",
      children: <MantineReactTable table={tableReview} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  async function fetchData() {
    setIsLoading(true);
    setIsRefetching(true);

    let url = `${API_ROUTER.GET_LIST_USER}?PageIndex=${pagination.pageIndex}&PageSize=${pagination.pageSize}`;

    try {
      if (keySearch.length > 0) {
        url += `&KeySearch=${keySearch}`;
      }
      const repo = new DegreeRepository<any>();
      const dataApi = await repo.get(url);
      if (dataApi) {
        const result = dataApi?.data;
        if (result) {
          setData(result);
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

  useEffect(() => {
    fetchData();
  }, [deleteViewStatus]);

  useEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const handleResize = () => {
      setHeight(window.innerHeight - (190 + headerHeight));
    };

    handleResize(); // Set initial height
    window.addEventListener("resize", handleResize); // Update height on window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up event listener
    };
  }, []);

  const tableReview = useMantineReactTable({
    columns,
    data: dataReview,
    positionToolbarAlertBanner: "bottom",
    enableTopToolbar: false,
    mantineTopToolbarProps: {
      style: {
        borderBottom: "3px solid rgba(128, 128, 128, 0.5)",
        marginBottom: 5,
      },
    },
    renderBottomToolbar: <></>,
    enableRowSelection: true,
    initialState: {
      columnPinning: {
        left: ["mrt-row-select", "groupCode"],
      },
      showColumnFilters: false,
      columnVisibility: { id: false, action: false },
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
    mantineTableBodyCellProps: ({ row }) => ({
      style: {
        fontWeight: "normal",
        fontSize: "12.5px",
        padding: "5px 15px",
      },
    }),
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      showSkeletons: isLoading,
      rowSelection,
    },
    mantineToolbarAlertBannerProps: isError
      ? { color: "red", children: "Lỗi tải dữ liệu !" }
      : undefined,
    mantinePaginationProps: {
      showRowsPerPage: true,
      withEdges: true,
      rowsPerPageOptions: ["10", "50", "100"],
    },
    paginationDisplayMode: "pages",
    enableColumnPinning: true,
    mantineTableProps: {
      striped: true,
    },
    columnFilterDisplayMode: "popover",
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: { cursor: "pointer" },
    }),
  });

  const table = useMantineReactTable({
    columns: columns,
    data: data,
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: () => (
      <Flex justify={"space-between"} w={"100%"}>
        <Flex gap="md">
          <TextInput
            placeholder="Nhập từ khóa"
            value={keySearch}
            onChange={(e) => setKeySearch(e.currentTarget.value)}
          />
          <Button
            leftSection={<IconSearch size={"15px"} />}
            onClick={() => fetchData()}
          >
            Tìm kiếm
          </Button>
        </Flex>

        <Flex>
          <Button>
            Thêm mới
            <IconPlus size={"15px"} />
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

  return <MantineReactTable table={table} />;
};

export default User;
