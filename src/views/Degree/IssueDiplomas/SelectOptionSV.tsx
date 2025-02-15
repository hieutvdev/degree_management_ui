import { Box, Button, ComboboxItem, Flex, Grid, Select } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { API_ROUTER } from "../../../constants/api/api_router";
import { DegreeRepository } from "../../../services/RepositoryBase";
import { useEffect, useState } from "react";
import { modals } from "@mantine/modals";
import { YearPickerInput } from "@mantine/dates";
import dayjs from "dayjs";

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

  useEffect(() => {
    getSelectPeriod();
  }, []);

  return (
    <Box mt={10} w={"30vw"} maw={400}>
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
          <YearPickerInput
            label="Năm tốt nghiệp"
            placeholder="Năm tốt nghiệp"
            onChange={(e) =>
              setYear(
                e
                  ? new Date(dayjs(e).add(7, "hour").toDate())?.toISOString()
                  : ""
              )
            }
          />
        </Grid.Col>
      </Grid>
      <Flex justify={"end"} mt={15}>
        <Button
          variant="outline"
          leftSection={<IconCheck size={"14px"} />}
          onClick={() => modals.closeAll()}
        >
          Xác nhận
        </Button>
      </Flex>
    </Box>
  );
};

export default SelectOptionSV;
