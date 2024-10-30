import {
  TextInput,
  Flex,
  Button,
  Tooltip,
  ActionIcon,
  Badge,
} from "@mantine/core";
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_RowSelectionState,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import React, { useEffect, useState } from "react";
import {
  IconEdit,
  IconEye,
  IconGenderFemale,
  IconGenderMale,
  IconGenderThird,
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
// import CreateDataView from "./CreateDataView";
import {
  paginationBase,
  PaginationResponseBase,
} from "../../../interfaces/PaginationResponseBase";
import { DegreeTypeModelQuery } from "../../../interfaces/DegreeType";
import { API_ROUTER } from "../../../constants/api/api_router";
import { StudentGraduated } from "../../../interfaces/StudentGraduated";
import {
  formatDateTime,
  formatDateTransfer,
  formatYear,
} from "../../../helpers/FunctionHelper";
import CreateDataView from "./CreateDataView";

const StudentGraduatedView = () => {
  //data and fetching state
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = useState<StudentGraduated[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [height, setHeight] = useState(0);
  const [pagination, setPagination] =
    useState<MRT_PaginationState>(paginationBase);
  //table state
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [selectIds, setSelectIds] = useState<string[]>([]);
  const [deleteViewStatus, setDeleteViewStatus] = useState(false);

  const columns = React.useMemo<MRT_ColumnDef<StudentGraduated>[]>(
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
        accessorKey: "fullName",
        header: "Họ và tên sinh viên",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "dateOfBirth",
        header: "Ngày sinh",
        Cell: ({ renderedCellValue }: any) => (
          <>{renderedCellValue && formatDateTime(renderedCellValue)}</>
        ),
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "gender",
        header: "Giới tính",
        Cell: ({ renderedCellValue }: any) => (
          <>
            <Badge variant="light" color={getColorOfGender(renderedCellValue)}>
              <Flex align={"center"}>{renderGender(renderedCellValue)}</Flex>
            </Badge>
          </>
        ),
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
        Cell: ({ renderedCellValue }: any) => (
          <>{renderedCellValue && formatYear(renderedCellValue)}</>
        ),
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "majorName",
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
        Cell: ({ renderedCellValue }: any) => (
          <>{getHonors(renderedCellValue)}</>
        ),
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
  const getColorOfGender = (gender: boolean) => {
    return gender ? "pink" : "green";
  };

  const renderGender = (gender: boolean) => {
    return gender ? (
      <>
        <IconGenderFemale size={14} color={"pink"}></IconGenderFemale>
        Nữ
      </>
    ) : (
      <>
        <IconGenderMale size={14} color={"green"}></IconGenderMale>
        Nam
      </>
    );
  };

  const getHonors = (honorId: number) => {
    switch (honorId) {
      case 0:
        return "Kém";
      case 1:
        return "Yếu";
      case 2:
        return "Trung bình";
      case 3:
        return "Khá";
      case 4:
        return "Giỏi";
      case 5:
        return "Xuất sắc";
      default:
        return "Không xác định";
    }
  };

  async function fetchData() {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const url = `${API_ROUTER.GET_LIST_STUDENTS}?PageIndex=${pagination.pageIndex}&PageSize=${pagination.pageSize}`;
      const repo = new DegreeRepository<StudentGraduated>();
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
      title: "Tạo mới sinh viên",
      size: "auto",
      children: <CreateDataView onClose={setDeleteViewStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // const handleEdit = () => {
  //   modals.openConfirmModal({
  //     title: "Sửa sinh viên",
  //     size: "auto",
  //     children: <CreateDataView />,
  //     confirmProps: { display: "none" },
  //     cancelProps: { display: "none" },
  //   });
  // };

  // const handleDetail = () => {
  //   modals.openConfirmModal({
  //     title: "Xem chi tiết sinh viên",
  //     size: "auto",
  //     children: <CreateDataView />,
  //     confirmProps: { display: "none" },
  //     cancelProps: { display: "none" },
  //   });
  // };

  // useHotkeys([
  //   [
  //     "F11",
  //     () => {
  //       handleCreate();
  //     },
  //   ],
  // ]);

  useEffect(() => {
    fetchData();
  }, [deleteViewStatus]);

  useEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const handleResize = () => {
      setHeight(window.innerHeight - (140 + headerHeight));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
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
        left: ["mrt-row-select", "index", "fullName"],
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

export default StudentGraduatedView;
