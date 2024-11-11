import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  CreateInwardModel,
  StockInInvSuggestDetail,
} from "../../../interfaces/Inward";
import {
  ActionIcon,
  Box,
  ComboboxItem,
  Grid,
  NumberInput,
  Select,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import { IconTrash } from "@tabler/icons-react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";

const DetailDataView = ({ id }: { id: any }) => {
  const entity = {
    warehouseId: null,
    requestPersonId: null,
    code: null,
    stockInInvSuggestDetails: null,
    status: 1,
    note: null,
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const [stockInInvSuggestDetails, setStockInInvSuggestDetails] = useState<
    StockInInvSuggestDetail[]
  >([]);

  const [dataWareHouseSelect, setDataWareHouseSelect] = useState<
    ComboboxItem[]
  >([]);
  const [dataDegreeTypeSelect, setDataDegreeTypeSelect] = useState<
    ComboboxItem[]
  >([]);

  const form = useForm<CreateInwardModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    transformValues: (values) => ({
      ...values,
      warehouseId: Number(values.warehouseId),
    }),

    validate: {},
  });

  const removeByDegreeTypeId = (degreeTypeId: any) => {
    setStockInInvSuggestDetails((prevState) =>
      prevState.filter((item) => item.degreeTypeId !== degreeTypeId)
    );
  };

  const columns = React.useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "degreeTypeId",
        header: "Loại văn bằng",
        Cell: ({ row }) => (
          <Select
            placeholder="Chọn loại văn bằng"
            data={dataDegreeTypeSelect}
            value={row.original.degreeTypeId?.toString()}
            rightSection={" "}
            variant="unstyled"
            readOnly
          />
        ),
        enableColumnActions: false,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        accessorKey: "quantity",
        header: "Số lượng",
        size: 50,
        enableColumnActions: false,
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    [dataDegreeTypeSelect, stockInInvSuggestDetails]
  );

  const table = useMantineReactTable({
    columns,
    data: form.getValues().stockInInvSuggestDetails ?? [],
    positionToolbarAlertBanner: "bottom",
    enableTopToolbar: false,
    enableBottomToolbar: false,
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
      style: { maxHeight: 350, minHeight: 350 },
    },
    enableStickyHeader: true,
    manualFiltering: false,
    manualPagination: true,
    manualSorting: false,
    mantineTableBodyCellProps: () => ({
      style: {
        fontWeight: "500",
        fontSize: "12.5px",
        padding: "5px 15px",
      },
    }),
    state: {},
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

  const getDetailInward = async () => {
    const url = `${API_ROUTER.GET_DETAIL_INWARD}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(`${url}?id=${id}`);

    if (dataApi?.isSuccess) {
      const result = dataApi.data;
      form.setValues(result ?? {});
      Promise.all([getSelectWareHouse(), getSelectDegreeType()]);
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

  useEffect(() => {
    getDetailInward();
  }, []);

  return (
    <Box maw={800} w={"50vw"} component="form" mx="auto">
      <Grid mt={10}>
        <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
          <MantineReactTable table={table} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
          <TextInput
            label="Mã nhập kho"
            placeholder="Mã nhập kho"
            value={form.getValues().code ?? ""}
            variant="filled"
            readOnly
            {...form.getInputProps("code")}
          />
          <Select
            label="Kho"
            placeholder="Nhập tên kho"
            data={dataWareHouseSelect}
            value={
              form.getValues().warehouseId
                ? form.getValues().warehouseId?.toString()
                : null
            }
            variant="filled"
            readOnly
            {...form.getInputProps("warehouseId")}
          />
          <Select
            label="Trạng thái"
            value={form.getValues().status?.toString()}
            data={[
              { label: "Chờ duyệt", value: "1" },
              { label: "Từ chối", value: "2" },
              { label: "Đã duyệt", value: "3" },
            ]}
            variant="filled"
            readOnly
          />
          <Textarea
            label="Ghi chú"
            placeholder="Nhập ghi chú"
            variant="filled"
            readOnly
            {...form.getInputProps("note")}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default DetailDataView;
