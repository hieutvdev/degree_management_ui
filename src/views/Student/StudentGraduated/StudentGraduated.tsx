import { TextInput, Flex, Button, Tooltip, ActionIcon } from "@mantine/core";
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
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import {
  DegreeRepository,
  RepositoryBase,
} from "../../../services/RepositoryBase";
import { ResponseBase } from "../../../interfaces/ResponseBase";
import { useHotkeys } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import CreateDataView from "./CreateDataView";
import { paginationBase } from "../../../interfaces/PaginationResponseBase";
import { DegreeTypeModelQuery } from "../../../interfaces/DegreeType";

const StudentGraduated = () => {
  //data and fetching state
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = useState<DegreeTypeModelQuery[]>([]);
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
        accessorKey: "fullName",
        header: "Họ tên sinh viên",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "dateOfBirth",
        header: "Ngày sinh",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "gender",
        header: "Giới tính",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "phoneNumber",
        header: "Số điện thoại",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "contactEmail",
        header: "Email",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "graduationYear",
        header: "Năm tốt nghiệp",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "majorId",
        header: "Ngành học",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "gpa",
        header: "GPA",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "honors",
        header: "Loại tốt nghiệp",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "action",
        header: "Thao tác",
        size: 10,
        Cell: () => (
          <Flex gap={"md"} align={"center"}>
            <Tooltip label="Chỉnh sửa">
              <ActionIcon variant="light" color="orange">
                <IconEdit size={20} stroke={1.5} />
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

  const fetchData = async () => {
    setIsLoading(true);
    setIsRefetching(true);
    setIsError(false);
    setData([]);
    setRowCount(0);

    // let url = `?Skip=${pagination?.pageIndex * pagination?.pageSize}&Take=${
    //   pagination.pageSize
    // }`;

    const fetchDataGetList = async () => {
      try {
        const repo = new DegreeRepository<DegreeTypeModelQuery>();
        const dataApi = await repo.getLists("aaa");

        if (dataApi && dataApi.isSuccess) {
          const result = dataApi.data;
          setData(result?.items && result.items ? result.items : []);
          setSelectIds([]);
          table.resetRowSelection();
          setIsLoading(false);
          setIsRefetching(false);
        }
      } catch (error) {
        console.error("Error fetching faculty list:", error);
      }
    };

    fetchDataGetList();
  };

  const handleCreate = () => {
    // setDeleteViewStatus(!deleteViewStatus);
    modals.openConfirmModal({
      title: "Tạo mới khoa",
      size: "auto",
      children: <CreateDataView />,
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
  }, []);

  useEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const handleResize = () => {
      // 190 là chiều cao của phần phân trang
      // headerHeight là chiều cao của phần header
      setHeight(window.innerHeight - (140 + headerHeight));
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
        left: ["mrt-row-select", "code"],
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

export default StudentGraduated;
