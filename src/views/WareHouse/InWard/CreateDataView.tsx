import {
  ActionIcon,
  Box,
  ComboboxItem,
  Grid,
  Select,
  TextInput,
  Tooltip,
  Button,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  CreateInwardModel,
  StockInInvSuggestDetail,
} from "../../../interfaces/Inward";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { useEffect, useState } from "react";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import React from "react";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

const CreateDataView = ({ onClose }: { onClose: any }) => {
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

    validate: {
      warehouseId: (value: number | null) => {
        if (!value) {
          return "Vui lòng nhập kho !";
        }
      },
    },
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
            onChange={(e) =>
              setStockInInvSuggestDetails((prev: any) => {
                const updateData = [...prev];
                updateData[row.index] = {
                  ...updateData[row.index],
                  degreeTypeId: e ? Number(e) : null,
                };
                return updateData;
              })
            }
          />
        ),
        enableColumnActions: false,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        accessorKey: "quantity",
        header: "Số lượng",
        Cell: ({ row }) => (
          <NumberInput
            placeholder="Nhập số lượng"
            min={0}
            hideControls
            onChange={(e) =>
              setStockInInvSuggestDetails((prev: any) => {
                const updateData = [...prev];
                updateData[row.index] = {
                  ...updateData[row.index],
                  quantity: e ? Number(e) : null,
                };
                return updateData;
              })
            }
          />
        ),
        enableColumnActions: false,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        accessorKey: "action",
        header: "Thao tác",
        size: 10,
        Cell: ({ row }) => (
          <Tooltip label="Xóa">
            <ActionIcon
              variant="light"
              color="red"
              onClick={() =>
                removeByDegreeTypeId(
                  stockInInvSuggestDetails[row.index].degreeTypeId
                )
              }
            >
              <IconTrash size={20} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        ),
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilter: false,
      },
    ],
    [dataDegreeTypeSelect, stockInInvSuggestDetails]
  );

  const table = useMantineReactTable({
    columns,
    data: stockInInvSuggestDetails,
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

  const handleCreateInward = async (dataSubmit: CreateInwardModel) => {
    if (stockInInvSuggestDetails?.length > 0) {
      const url = `${API_ROUTER.CREATE_INWARD}`;
      const repo = new DegreeRepository<CreateInwardModel>();
      const dataApi = await repo.post(url, {
        ...dataSubmit,
        requestPersonId: 0,
        stockInInvSuggestDetails: stockInInvSuggestDetails,
      });

      if (dataApi && dataApi?.isSuccess) {
        onClose((prev: any) => !prev);
        notifications.show({
          color: "green",
          message: "Nhập kho thành công !",
        });
        modals.closeAll();
      }
    } else {
      notifications.show({
        color: "red",
        message: "Vui lòng thêm phôi loại văn bằng !",
      });
      return;
    }
  };

  const getCreateInward = async () => {
    const url = `${API_ROUTER.GET_CREATE_INWARD}`;
    const repo = new DegreeRepository<CreateInwardModel>();
    const dataApi = await repo.get(`${url}?prefix=NKVB`);

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
    getCreateInward();
  }, []);

  return (
    <Box
      maw={800}
      w={"50vw"}
      component="form"
      mx="auto"
      onSubmit={form.onSubmit((e: CreateInwardModel) => {
        handleCreateInward(e);
      })}
    >
      <Grid mt={10}>
        <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
          <MantineReactTable table={table} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
          <Button
            variant="outline"
            color="blue"
            leftSection={<IconPlus size={"14px"} />}
            w={"100%"}
            onClick={() =>
              setStockInInvSuggestDetails((prev) => [
                ...prev,
                {
                  id: 0,
                  stockInInvSuggestId: 0,
                  degreeTypeId: 0,
                  quantity: 0,
                },
              ])
            }
          >
            Thêm phôi văn bằng
          </Button>
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
            searchable
            clearable
            nothingFoundMessage="Không tìm thấy kho !"
            {...form.getInputProps("warehouseId")}
            withAsterisk
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
            {...form.getInputProps("note")}
          />
          <Button
            variant="outline"
            color="teal"
            leftSection={<IconCheck size={"14px"} />}
            mt={15}
            w={"100%"}
            type="submit"
          >
            Lưu
          </Button>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default CreateDataView;
