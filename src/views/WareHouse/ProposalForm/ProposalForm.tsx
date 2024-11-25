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
import React, { useEffect, useRef, useState } from "react";
import { paginationBase } from "../../../interfaces/PaginationResponseBase";
import {
  IconCheck,
  IconDownload,
  IconEye,
  IconPlus,
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
import PrintIssueDiplomas from "./PrintIssueDiplomas";
import { formatDateTime } from "../../../helpers/FunctionHelper";
import PrintDiplomaApproved from "./PrintDiplomaApproved";

const ProposalForm = () => {
  //data and fetching state
  const navigate = useNavigate();
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any[]>([
    {
      id: 1,
      ngayDeXuat: new Date().toISOString(),
      soQD: 712867946,
      code: "PDX20241125000",
      idLoaiPhieu: 1,
      loaiPhieu: "Cử nhân",
      soPhoiDeNghiCap: 400,
      status: 0,
    },
    {
      id: 2,
      ngayDeXuat: new Date().toISOString(),
      soQD: 983712489,
      code: "PDX20241125001",
      idLoaiPhieu: 1,
      loaiPhieu: "Cử nhân",
      soPhoiDeNghiCap: 200,
      status: 1,
    },
  ]);
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
  const componentRef = React.useRef(null);
  const componentRefApproved = React.useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
      @page {
        size:auto;
        margin: 5mm 0;
    }`,
  });

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
        accessorKey: "ngayDeXuat",
        header: "Ngày đề xuất",
        Cell: ({ renderedCellValue }: any) => (
          <>{renderedCellValue && formatDateTime(renderedCellValue)}</>
        ),
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "soQD",
        header: "Số QĐ",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "code",
        header: "Mã phiếu",
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
        accessorKey: "loaiPhieu",
        header: "Loại phiếu",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "soPhoiDeNghiCap",
        header: "Số phôi đề nghị cấp",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        Cell: ({ renderedCellValue }) => (
          <Badge
            color={renderedCellValue === 0 ? "red" : "green"}
            radius={"sm"}
          >
            {renderedCellValue === 0 ? "Chưa duyệt" : "Đã duyệt"}
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
                  disabled={row.original.status !== 0}
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
                  >
                    Duyệt
                  </Button>
                  <Button
                    variant="outline"
                    leftSection={<IconX size={"14px"} />}
                    color="red"
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
                onClick={() => detailItem()}
              >
                <IconEye size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="In phiếu đề xuất">
              <ActionIcon
                variant="light"
                color="teal"
                onClick={() => {
                  if (row.original.status === 0) {
                    handlePrint();
                  } else if (row.original.status === 1) {
                    handlePrintApproved();
                  }
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

  const detailItem = () => {
    modals.openConfirmModal({
      title: <Title order={5}>Phiếu xuất kho phôi văn abwnfg tốt nghiệp</Title>,
      size: "auto",
      children: <DetailDataView />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

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
            onClick={() => navigate("/diploma-number")}
          >
            Chạy số hiệu
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

  return (
    <>
      <MantineReactTable table={table} />
      <Box display={"none"}>
        <PrintIssueDiplomas innerRef={componentRef} />
        <PrintDiplomaApproved innerRef={componentRefApproved} />
      </Box>
    </>
  );
};

export default ProposalForm;
