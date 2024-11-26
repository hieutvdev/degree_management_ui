import {
  TextInput,
  Flex,
  Button,
  Badge,
  Tooltip,
  ActionIcon,
  Text,
  Title,
  Box,
  Menu,
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
  IconCheck,
  IconEye,
  IconPrinter,
  IconSearch,
  IconStatusChange,
  IconX,
} from "@tabler/icons-react";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import DetailDataView from "./DetailDataView";
import { useReactToPrint } from "react-to-print";
import { formatDateTime } from "../../../helpers/FunctionHelper";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { notifications } from "@mantine/notifications";
import PrintIssueDiplomas from "./PrintIssueDiplomas";

const EmbryoExport = () => {
  //data and fetching state
  const navigate = useNavigate();
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
  //export PDF
  const [dataPrint, setDataPrint] = useState();
  const componentRefApproved = React.useRef(null);
  const handlePrintApproved = useReactToPrint({
    contentRef: componentRefApproved,
    pageStyle: `
        @page {
          size:auto;
          margin: 5mm 0;
      }`,
  });

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
        accessorKey: "issueDate",
        header: "Ngày đề xuất",
        Cell: ({ renderedCellValue }: any) => (
          <>{renderedCellValue && formatDateTime(renderedCellValue)}</>
        ),
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "decisionNumber",
        header: "Số QĐ",
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
        accessorKey: "degreeTypeName",
        header: "Loại văn bằng",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "quantityRequest",
        header: "Số lượng đề xuất",
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        Cell: ({ renderedCellValue }) => (
          <Badge
            color={
              renderedCellValue === 3
                ? "yellow"
                : renderedCellValue === 4
                ? "green"
                : "red"
            }
            radius={"sm"}
          >
            {renderedCellValue === 3
              ? "Đang chờ duyệt"
              : renderedCellValue === 4
              ? "Đã duyệt"
              : "Từ chối"}
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
            <Menu>
              <Menu.Target>
                <ActionIcon
                  variant="light"
                  color="teal"
                  disabled={row.original.status !== 3}
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
                    onClick={() => modalApprove(true, Number(row.original.id))}
                  >
                    Duyệt
                  </Button>
                  <Button
                    variant="outline"
                    leftSection={<IconX size={"14px"} />}
                    color="red"
                    onClick={() => modalApprove(false, Number(row.original.id))}
                  >
                    Từ chối
                  </Button>
                </Flex>
              </Menu.Dropdown>
            </Menu>
            {/* <Tooltip label="Chi tiết">
              <ActionIcon
                variant="light"
                color="cyan"
                onClick={() => detailItem()}
              >
                <IconEye size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip> */}

            <Tooltip label="In phiếu đề xuất">
              <ActionIcon
                variant="light"
                color="teal"
                onClick={() => {
                  setDataPrint(row.original);
                  handlePrintApproved();
                }}
              >
                <IconPrinter size={20} stroke={1.5} />
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
      const url = `${API_ROUTER.GET_LIST_OUTWARD}?PageIndex=${pagination.pageIndex}&PageSize=${pagination.pageSize}&Type=2`;
      const repo = new DegreeRepository<any>();
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
    const url = `${API_ROUTER.APPROVE_OUTWARD}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.post(url, {
      templateProposalId: id,
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

  const modalApprove = (isApproved: boolean, id: number | null) => {
    modals.openConfirmModal({
      title: <Title order={5}>Duyệt phiếu xuất kho</Title>,
      size: "auto",
      children: (
        <Box mt={15}>
          <Text fw={500} size="20px">
            {isApproved
              ? "Bạn có chắc muốn duyệt phiếu xuất kho này ?"
              : "Bạn có chắc muốn từ chối phiếu xuất kho này ?"}
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

  const detailItem = () => {
    modals.openConfirmModal({
      title: <Title order={5}>Phiếu xuất kho phôi văn bằng tốt nghiệp</Title>,
      size: "auto",
      children: <DetailDataView />,
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
        left: ["mrt-row-select", "index", "decisionNumber"],
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

  return (
    <>
      <MantineReactTable table={table} />
      <Box display={"none"}>
        <PrintIssueDiplomas
          innerRef={componentRefApproved}
          dataPrint={dataPrint}
        />
      </Box>
    </>
  );
};

export default EmbryoExport;
