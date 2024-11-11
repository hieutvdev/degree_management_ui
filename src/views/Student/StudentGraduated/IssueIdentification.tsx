import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IssueIdentificationModel } from "../../../interfaces/DegreeManagement";

const IssueIdentification = ({
  onClose,
  selectIds,
}: {
  onClose: any;
  selectIds: any;
}) => {
  const entity = {
    studentIds: selectIds,
    warehouseId: null,
    decisionNumber: null,
    prefixCode: null,
    startCodeNum: null,
    codeLength: null,
    suffixCode: null,
    prefixRegNo: null,
    startRegNoNum: null,
    regNoLength: null,
    suffixRegNo: null,
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<IssueIdentificationModel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...entity,
    },

    validate: {},
  });

  return <></>;
};

export default IssueIdentification;
