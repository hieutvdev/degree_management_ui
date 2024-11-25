import { Box, Button, ComboboxItem, Flex, Grid, Select } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { useEffect, useState } from "react";
import { modals } from "@mantine/modals";

const SelectOptionSV = ({
  period,
  year,
  setPeriod,
  setYear,
}: {
  period: any;
  year: any;
  setPeriod: any;
  setYear: any;
}) => {
  const [dataPeriodSelect, setDataPeriodSelect] = useState<ComboboxItem[]>([]);
  const [dataYearGraduation, setDataYearGraduation] = useState<ComboboxItem[]>(
    []
  );

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

  const getSelectYearGraduation = async () => {
    const url = `${API_ROUTER.GET_SELECT_YEAR_GRADUATION}`;
    const repo = new DegreeRepository<any>();
    const dataApi = await repo.get(url);

    if (dataApi?.isSuccess) {
      const result = dataApi?.data;
      setDataYearGraduation(
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
    getSelectPeriod();
    getSelectYearGraduation();
  }, []);

  return (
    <Box mt={10}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
          <Select
            label="Đợt tốt nghiệp"
            placeholder="Nhập đợt tốt nghiệp"
            data={dataPeriodSelect}
            searchable
            clearable
            nothingFoundMessage="Không tìm thấy đợt tốt nghiệp !"
            onChange={(e) => setPeriod(e)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
          <Select
            label="Năm tốt nghiệp"
            placeholder="Chọn năm tốt nghiệp"
            data={dataYearGraduation}
            onChange={(e) => setYear(e)}
          />
        </Grid.Col>
      </Grid>
      <Flex justify={"end"} mt={15}>
        <Button
          variant="outline"
          leftSection={<IconCheck size={"14px"} />}
          onClick={() => modals.closeAll()}
          disabled={period || year}
        >
          Xác nhận
        </Button>
      </Flex>
    </Box>
  );
};

export default SelectOptionSV;
