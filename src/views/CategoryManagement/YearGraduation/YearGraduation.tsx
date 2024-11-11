import {
  TextInput,
  Flex,
  Button,
  Badge,
  Tooltip,
  ActionIcon,
  Text,
  Title,
  Menu,
  rem,
} from "@mantine/core";
import {
  MRT_ColumnDef,
  MRT_RowSelectionState,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import React, { useEffect, useState } from "react";
import {
  IconCaretDown,
  IconDownload,
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import CreateDataView from "./CreateDataView";
import { paginationBase } from "../../../interfaces/PaginationResponseBase";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { API_ROUTER } from "../../../constants/api/api_router";
import DeleteDataView from "./DeleteDataView";
import DetailDataView from "./DetailDataView";
import EditDataView from "./EditDataView";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { notifications } from "@mantine/notifications";
import * as xlsx from "xlsx";
import DropZoneFile from "../../../utils/extensions/DropZoneFile";
import { ModelYearGraduationQuery } from "../../../interfaces/YearGraduation";

const YearGraduation = () => {
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
        accessorKey: "name",
        header: "Năm tốt nghiệp",
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
        Cell: ({ row }) => (
          <Flex gap={"md"} align={"center"}>
            <Tooltip label="Chỉnh sửa">
              <ActionIcon
                variant="light"
                color="orange"
                onClick={() => handleUpdate(row.original.id)}
              >
                <IconEdit size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Chi tiết">
              <ActionIcon
                variant="light"
                color="cyan"
                onClick={() => handleDetail(row.original.id)}
              >
                <IconEye size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Xóa">
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => handleDelete(row.original.id)}
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

  const handleImportExcel = async (file: any) => {
    if (!file) {
      notifications.show({
        color: "red",
        message: "Vui lòng chọn lại tệp !",
      });
      return;
    } else {
      modals.closeAll();
      notifications.show({
        color: "green",
        message: "Import excel thành công !",
      });
    }

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = xlsx.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[sheetName];
        worksheet = xlsx.utils.sheet_add_aoa(
          worksheet,
          [["code", "name", "active", "description"]],
          { origin: "A1" }
        );
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
        const dataSubmit = jsonData?.map((item: any, index) => ({
          id: "0",
          code: item.code,
          name: item.name,
          active: item.active,
          description: item.description,
        }));
        setDataReview(dataSubmit);
        setTimeout(() => {
          reviewDataImport();
        }, 1000);
      }
    };
    fileReader.readAsBinaryString(file);
  };

  const handleOpenFileDrop = () => {
    try {
      modals.openConfirmModal({
        title: null,
        withCloseButton: false,
        children: <DropZoneFile onImport={handleImportExcel}></DropZoneFile>,
        confirmProps: { display: "none" },
        cancelProps: { display: "none" },
      });
    } catch (e) {
      notifications.show({ color: "red", message: "Import excel thất bại" });
    }
  };

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
    try {
      const url = `${API_ROUTER.GET_LIST_YEAR_GRADUATION}?PageIndex=${pagination.pageIndex}&PageSize=${pagination.pageSize}`;
      const repo = new DegreeRepository<ModelYearGraduationQuery>();
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

  const createListDebtGroup = async () => {
    const url = "/api/v1/TblDebtGroup/create-list";
    const repo = new DegreeRepository<any>();

    try {
      if (dataReview.length > 0) {
        const response = await repo.post(url, dataReview);
        if (response?.isSuccess) {
          notifications.show({
            color: "green",
            message: "Tạo mới thành công!",
          });
          modals.closeAll();
        }
      } else {
        notifications.show({
          color: "red",
          message: "Vui lòng thêm nhóm công nợ!",
        });
      }
    } catch (e) {
      console.error(e);
      return;
    }
  };

  const handleCreate = () => {
    modals.openConfirmModal({
      title: <Title order={5}>Thêm năm tốt nghiệp</Title>,
      size: "auto",
      children: <CreateDataView onClose={setDeleteViewStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleUpdate = (id: string | number) => {
    modals.openConfirmModal({
      title: <Title order={5}>Chỉnh sửa năm tốt nghiệp</Title>,
      size: "auto",
      children: <EditDataView id={id} onClose={setDeleteViewStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleDetail = (id: string | null) => {
    modals.openConfirmModal({
      title: <Title order={5}>Chi tiết năm tốt nghiệp</Title>,
      size: "auto",
      children: <DetailDataView id={id} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleDelete = (id: string | number) => {
    modals.openConfirmModal({
      title: <Title order={5}>Xóa năm tốt nghiệp</Title>,
      size: "auto",
      children: <DeleteDataView onClose={setDeleteViewStatus} id={id} />,
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
    renderBottomToolbar: (
      <>
        <Flex w={"100%"} my={"10px"} pr={"20px"} justify={"flex-end"}>
          <Button
            onClick={() => {
              createListDebtGroup();
            }}
          >
            Tạo mới
          </Button>
        </Flex>
      </>
    ),
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
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button
                rightSection={
                  <IconCaretDown style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Chức năng
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={handleExportData}
                leftSection={<IconDownload size={"15px"} />}
              >
                Export Data
              </Menu.Item>
              {/* <Menu.Item
                leftSection={
                  <IconUpload style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={() => handleOpenFileDrop()}
              >
                Import Excel
              </Menu.Item> */}
            </Menu.Dropdown>
          </Menu>
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

export default YearGraduation;
