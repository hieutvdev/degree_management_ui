import {
  ActionIcon,
  Badge,
  Button,
  ComboboxItem,
  Flex,
  Grid,
  Menu,
  rem,
  Select,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconCaretDown,
  IconDownload,
  IconEye,
  IconGenderFemale,
  IconGenderMale,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_RowSelectionState,
  useMantineReactTable,
} from "mantine-react-table";
import React, { useEffect, useState } from "react";
import { DegreeRepository } from "../../../services/RepositoryBase";
// import CreateDataView from "./CreateDataView";
import { API_ROUTER } from "../../../constants/api/api_router";
import { formatDateTime, formatYear } from "../../../helpers/FunctionHelper";
import { paginationBase } from "../../../interfaces/PaginationResponseBase";
import { StudentGraduated } from "../../../interfaces/StudentGraduated";
import CreateDataView from "./CreateDataView";
import EditDataView from "./EditDataView";
import DetailDataView from "./DetailDataView";
import DeleteDataView from "./DeleteDataView";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { notifications } from "@mantine/notifications";
import * as xlsx from "xlsx";
import DropZoneFile from "../../../utils/extensions/DropZoneFile";
import IssueIdentification from "./IssueIdentification";
import { YearPickerInput } from "@mantine/dates";
import dayjs from "dayjs";

const StudentGraduatedView = ({
  isDiplomaNumber,
  period,
  year,
  setStudentIds,
}: {
  isDiplomaNumber: any;
  period?: any;
  year?: any;
  setStudentIds?: any;
}) => {
  //data and fetching state
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [dataReview, setDataReview] = useState<any[]>([]);
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

  const [dataPeriodSelect, setDataPeriodSelect] = useState<ComboboxItem[]>([]);
  const [dataMajorSelect, setDataMajorSelect] = useState<ComboboxItem[]>([]);
  const [dataDegreeTypeSelect, setDataDegreeTypeSelect] = useState<
    ComboboxItem[]
  >([]);
  //keySearch
  const [keySearch, setKeySearch] = useState({
    graduationYear: "",
    periodId: "",
    majorId: "",
    degreeTypeId: "",
    className: "",
    keySearch: "",
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
        accessorKey: "studentCode",
        header: "Mã sinh viên",
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
        enableColumnActions: false,
        enableColumnFilter: false,
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
        accessorKey: "birthPlace",
        header: "Nơi sinh",
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
        accessorKey: "className",
        header: "Lớp",
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
        accessorKey: "cohort",
        header: "Khóa tốt nghiệp",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "periodName",
        header: "Đợt tốt nghiệp",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "majorName",
        header: "Ngành",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "gpA4",
        header: "GPA (thang điểm 4)",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "gpA10",
        header: "GPA (thang điểm 10)",
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
        accessorKey: "degreeTypeName",
        header: "Loại văn bằng",
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      // {
      //   accessorKey: "status",
      //   header: "Trạng thái",
      //   Cell: ({ renderedCellValue }) => (
      //     <Badge
      //       color={
      //         renderedCellValue === 0
      //           ? "red"
      //           : renderedCellValue === 1
      //           ? "yellow"
      //           : "green"
      //       }
      //       radius={"sm"}
      //     >
      //       {renderedCellValue === 0
      //         ? "Chưa cấp văn bằng"
      //         : renderedCellValue === 1
      //         ? "Đang cấp văn bằng"
      //         : "Đã cấp văn bằng"}
      //     </Badge>
      //   ),
      // },
      {
        accessorKey: "action",
        header: "Thao tác",
        size: 10,
        Cell: ({ row }) =>
          !isDiplomaNumber ? (
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
          ) : (
            <Tooltip label="Chi tiết">
              <ActionIcon
                onClick={() => handleDetail(row.original.id)}
                variant="light"
                color="cyan"
              >
                <IconEye size={20} stroke={1.5} />
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
        worksheet = xlsx.utils.sheet_add_aoa(worksheet, [
          [
            "fullName",
            "dateOfBirth",
            "studentCode",
            "gender",
            "graduationYear",
            "specializationId",
            "periodId",
            "birthPlace",
            "className",
            "cohort",
            "status",
            "gpA10",
            "gpA4",
            "honors",
            "contactEmail",
            "phoneNumber",
            "degreeTypeId",
            "majorId",
          ],
        ]);
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
        const dataSubmit = jsonData?.map((item: any) => ({
          fullName: item.fullName,
          dateOfBirth: new Date(item.dateOfBirth)?.toISOString(),
          studentCode: item.studentCode,
          gender: item.gender,
          graduationYear: new Date(item.graduationYear)?.toISOString(),
          specializationId: item.specializationId,
          periodId: item.periodId,
          birthPlace: item.birthPlace,
          className: item.className,
          cohort: item.cohort?.toString(),
          status: item.status,
          gpA10: item.gpA10,
          gpA4: item.gpA4,
          honors: item.honors,
          contactEmail: item.contactEmail,
          phoneNumber: item.phoneNumber,
          degreeTypeId: item.degreeTypeId,
          majorId: item.majorId,
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
          <Title order={5}>Xem lại danh sách sinh viên !</Title>
        </>
      ),
      size: "auto",
      children: <MantineReactTable table={tableReview} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

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

  const handleChangeSearchValue = (value: string, key: string) => {
    setKeySearch((prevData) => ({ ...prevData, [key]: value }));
  };

  async function fetchData() {
    setIsLoading(true);
    setIsRefetching(true);

    let url = `${API_ROUTER.GET_LIST_STUDENTS}?PageIndex=${pagination.pageIndex}&PageSize=${pagination.pageSize}`;

    try {
      if (keySearch.keySearch.length > 0) {
        url += `&KeySearch=${keySearch.keySearch}`;
      }

      if (year !== null && year !== undefined) {
        url += `&GraduationYear=${year}`;
      }

      if (keySearch.graduationYear.length > 0) {
        url += `&GraduationYear=${keySearch.graduationYear}`;
      }

      if (period !== null && period !== undefined) {
        url += `&PeriodId=${period}`;
      }

      if (keySearch.periodId.length > 0) {
        url += `&PeriodId=${keySearch.periodId}`;
      }

      if (keySearch.majorId.length > 0) {
        url += `&MajorId=${keySearch.majorId}`;
      }

      if (keySearch.degreeTypeId.length > 0) {
        url += `&DegreeTypeId=${keySearch.degreeTypeId}`;
      }

      if (keySearch.className.length > 0) {
        url += `&ClassName=${keySearch.className}`;
      }

      const repo = new DegreeRepository<StudentGraduated>();
      const dataApi = await repo.getLists(url);
      if (dataApi && dataApi.isSuccess) {
        const result = dataApi?.data;
        if (result) {
          setData(result.data);
          setRowCount(result?.count ?? 0);
          Promise.all([
            getSelectPeriod(),
            getSelectMajor(),
            getSelectDegreeType(),
          ]);
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

  const createListStudentGraduated = async () => {
    const url = `${API_ROUTER.CREATE_LIST_STUDENT}`;
    const repo = new DegreeRepository<any>();

    try {
      if (dataReview.length > 0) {
        const response = await repo.post(url, { students: dataReview });
        if (response?.isSuccess) {
          setDeleteViewStatus(!deleteViewStatus);
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

  const getSelectPeriod = async () => {
    const url = `${API_ROUTER.GET_SELECT_PERIOD}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataPeriodSelect(
        result
          ?.filter((item: any) => item.text != null && item.value != null)
          ?.map((item: any) => ({
            label: item.text,
            value: item.value?.toString(),
          }))
      );
    }
  };

  const getSelectMajor = async () => {
    const url = `${API_ROUTER.GET_SELECT_MAJOR}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataMajorSelect(
        result
          ?.filter((item: any) => item.text != null && item.value != null)
          ?.map((item: any) => ({
            label: item.text,
            value: item.value?.toString(),
          }))
      );
    }
  };

  const getSelectDegreeType = async () => {
    const url = `${API_ROUTER.GET_SELECT_DEGREETYPE}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataDegreeTypeSelect(
        result
          ?.filter((item: any) => item.text != null && item.value != null)
          ?.map((item: any) => ({
            label: item.text,
            value: item.value?.toString(),
          }))
      );
    }
  };

  const handleCreate = () => {
    modals.openConfirmModal({
      title: <Title order={5}>Tạo mới sinh viên</Title>,
      size: "auto",
      children: <CreateDataView onClose={setDeleteViewStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleEdit = (id: number | string) => {
    modals.openConfirmModal({
      title: <Title order={5}>Sửa sinh viên</Title>,
      size: "auto",
      children: <EditDataView id={id} onClose={setDeleteViewStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleDetail = (id: number | string) => {
    modals.openConfirmModal({
      title: <Title order={5}>Xem chi tiết sinh viên</Title>,
      size: "auto",
      children: <DetailDataView id={id} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleDelete = (id: string | number) => {
    modals.openConfirmModal({
      title: <Title order={5}>Xóa sinh viên</Title>,
      size: "auto",
      children: <DeleteDataView onClose={setDeleteViewStatus} id={id} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleIssueIdentification = (selectIds: string[]) => {
    modals.openConfirmModal({
      title: <Title order={5}>Xuất số hiệu</Title>,
      size: "auto",
      children: (
        <IssueIdentification
          onClose={setDeleteViewStatus}
          selectIds={selectIds}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // useHotkeys([
  //   [
  //     "F11",
  //     () => {
  //       handleCreate();
  //     },
  //   ],
  // ]);

  useEffect(() => {
    const valuesList = Object.keys(rowSelection);
    setSelectIds(valuesList);
    if (valuesList.length < 1) setSelectIds([]);
    else {
      const valuesList = Object.keys(rowSelection);
      setSelectIds(valuesList);
    }
  }, [rowSelection]);

  useEffect(() => {
    fetchData();
  }, [deleteViewStatus, period, year]);

  useEffect(() => {
    if (data.length > 1 && period && year) {
      const ids = data.map((item) => item.id);
      setStudentIds(ids);
    }
  }, [data]);

  useEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const handleResize = () => {
      !isDiplomaNumber
        ? setHeight(window.innerHeight - (190 + headerHeight))
        : setHeight(window.innerHeight - (300 + headerHeight));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [height]);

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
              createListStudentGraduated();
            }}
          >
            Tạo mới
          </Button>
        </Flex>
      </>
    ),
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
        <Flex gap="md" w={"76%"}>
          <Grid w={"100%"}>
            <Grid.Col span={{ base: 12, md: 6, lg: 12 / 7 }}>
              <YearPickerInput
                placeholder="Năm tốt nghiệp"
                onChange={(e) =>
                  handleChangeSearchValue(
                    e
                      ? new Date(
                          dayjs(e).add(7, "hour").toDate()
                        )?.toISOString()
                      : "",
                    "graduationYear"
                  )
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 12 / 7 }}>
              <Select
                placeholder="Đợt tốt nghiệp"
                data={dataPeriodSelect}
                searchable
                clearable
                nothingFoundMessage="Không tìm thấy đợt tốt nghiệp !"
                onChange={(e) =>
                  handleChangeSearchValue(e?.toString() ?? "", "periodId")
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 12 / 7 }}>
              <Select
                placeholder="Ngành"
                data={dataMajorSelect}
                searchable
                clearable
                nothingFoundMessage="Không tìm thấy ngành !"
                onChange={(e) =>
                  handleChangeSearchValue(e?.toString() ?? "", "majorId")
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 12 / 7 }}>
              <Select
                placeholder="Loại văn bằng"
                data={dataDegreeTypeSelect}
                searchable
                clearable
                nothingFoundMessage="Không tìm thấy loại văn bẳng !"
                onChange={(e) =>
                  handleChangeSearchValue(e?.toString() ?? "", "degreeTypeId")
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 12 / 7 }}>
              <TextInput
                placeholder="Lớp"
                value={keySearch.className}
                onChange={(e) => {
                  handleChangeSearchValue(
                    e.currentTarget.value ?? "",
                    "className"
                  );
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 12 / 7 }}>
              <TextInput
                placeholder="Nhập từ khóa"
                value={keySearch.keySearch}
                onChange={(e) => {
                  handleChangeSearchValue(
                    e.currentTarget.value ?? "",
                    "keySearch"
                  );
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 12 / 7 }}>
              <Button
                leftSection={<IconSearch size={"15px"} />}
                onClick={() => fetchData()}
              >
                Tìm kiếm
              </Button>
            </Grid.Col>
          </Grid>
        </Flex>
        <Flex gap="md" w={"16%"}>
          <Button
            leftSection={<IconPlus size={"15px"} />}
            onClick={() => handleCreate()}
          >
            Thêm mới
          </Button>
          {/* <Button
            leftSection={<IconBook size={"15px"} />}
            onClick={() => handleIssueIdentification(selectIds)}
          >
            Xuất số hiệu
          </Button> */}
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
              <Menu.Item
                leftSection={
                  <IconUpload style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={() => handleOpenFileDrop()}
              >
                Import Excel
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </Flex>
    ),
    renderToolbarInternalActions: () => <></>,
    enableTopToolbar: !isDiplomaNumber,
    enableRowSelection: true,
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
        left: ["mrt-row-select", "index", "studentCode"],
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
