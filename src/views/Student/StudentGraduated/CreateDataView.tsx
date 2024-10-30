// import {
//   Box,
//   Button,
//   Checkbox,
//   Flex,
//   Grid,
//   Group,
//   LoadingOverlay,
//   TextInput,
//   Textarea,
// } from "@mantine/core";
// // import { hasLength, useForm } from "@mantine/form";
// // import { useDisclosure } from "@mantine/hooks";
// // import { modals } from "@mantine/modals";
// // import { IconCheck, IconWindow } from "@tabler/icons-react";
// // import { useEffect } from "react";
// // import { repositoryPos } from "../../../../_base/_const/_constVar";
// // import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
// // import { MessageResponse } from "../../../../model/MessageResponse";
// // import { TblDMInventory } from "../../../../model/TblDMInventory";
// // import { handleKeyDown } from "../../../../_base/helper/FunctionHelper";
// // import { sky_blue } from "../../../../const/variables";

// const CreateDataView = ({ onClose }: CreateDataViewProps) => {
//   const entity = {
//     id: "0",
//     idBranch: 0,
//     code: "",
//     name: "",
//     addr: "",
//     type: null,
//     phone: null,
//     fax: null,
//     note: null,
//     active: false,
//     closeBookDate: null,
//     isPrintInvoice: null,
//     isPrintReceve: null,
//     synDate: null,
//     oldInventoryCode: null,
//     codeoracle: null,
//     positionId: null,
//     createBy: null,
//     createDate: null,
//     lastUpdateBy: null,
//     lastUpdateDate: null,
//     openBookDate: null,
//   };

//   const [visible, { toggle, close, open }] = useDisclosure(false);

//   const form = useForm<TblDMInventory>({
//     mode: "uncontrolled",
//     validateInputOnChange: true,
//     initialValues: {
//       ...entity,
//     },

//     validate: {
//       name: (value: string | null) => {
//         if (!value) {
//           return "Vui lòng nhập tên kho!";
//         }
//         return hasLength(
//           { min: 5, max: 50 },
//           "Tên phải từ 5-50 kí tự!"
//         )(value as string);
//       },
//       code: (value: string | null) => {
//         if (!value) {
//           return "Vui lòng nhập mã kho!";
//         }
//         return hasLength(
//           { max: 10 },
//           "Mã phải nhỏ hơn 10 kí tự!"
//         )(value as string);
//       },
//       addr: (value: string | null) => {
//         if (!value) {
//           return "Vui lòng nhập địa chỉ kho!";
//         }
//         return hasLength(
//           { max: 250 },
//           "Địa chỉ không quá 250 kí tự!"
//         )(value as string);
//       },
//       phone: (value: string | null) => {
//         if (!value) {
//           return "Vui lòng nhập số điện thoại!";
//         }
//         if (!/^\d{8,10}$/.test(value)) {
//           return "Số điện thoại phải có từ 8 đến 10 chữ số!";
//         }
//       },
//       note: (value: string | null) => {
//         if (value && hasLength({ max: 250 })(value)) {
//           return "Ghi chú không quá 250 kí tự!";
//         }
//       },
//     },
//   });

//   const callApiGetData = async () => {
//     open();
//     const callApi = await repositoryPos.get<MessageResponse<TblDMInventory>>(
//       "/api/v1/TblDMInventory/create"
//     );
//     if (callApi?.success) {
//       const dataApi = callApi?.data;
//       if (dataApi !== null) {
//         form.setValues(dataApi);
//         form.resetDirty(dataApi);
//       }
//       close();
//     } else {
//       NotificationExtension.Fails("Bạn không có quyền tạo!!!");
//       modals.closeAll();
//     }
//   };

//   const handleCreateTblDMInventory = async (dataSubmit: TblDMInventory) => {
//     open();
//     const dataApi = await repositoryPos.post<MessageResponse<TblDMInventory>>(
//       "/api/v1/TblDMInventory/create",
//       dataSubmit
//     );
//     if (dataApi?.success) {
//       onClose((prev: any) => !prev);
//       modals.closeAll();
//       NotificationExtension.Success("Thêm thành công !");
//     }
//     close();
//   };

//   useEffect(() => {
//     callApiGetData();
//   }, []);

//   return (
//     <>
//       <Box
//         component="form"
//         mx="auto"
//         w={{ base: "250px", md: "300px", lg: "400px" }}
//         onSubmit={form.onSubmit((e: TblDMInventory) => {
//           handleCreateTblDMInventory(e);
//         })}
//         style={{ position: "relative" }}
//       >
//         <LoadingOverlay
//           visible={visible}
//           zIndex={1000}
//           overlayProps={{ radius: "sm", blur: 2 }}
//         />

//         <Grid mt={10}>
//           <Grid.Col span={4}>
//             <TextInput
//               label={"Mã kho"}
//               placeholder={"Nhập mã kho"}
//               type="text"
//               withAsterisk
//               onKeyDown={handleKeyDown}
//               {...form.getInputProps("code")}
//             />
//           </Grid.Col>
//           <Grid.Col span={8}>
//             <TextInput
//               label={"Tên kho"}
//               placeholder={"Nhập tên kho"}
//               type="text"
//               withAsterisk
//               w={"100%"}
//               {...form.getInputProps("name")}
//             />
//           </Grid.Col>
//         </Grid>

//         <Grid>
//           <Grid.Col>
//             <TextInput
//               label={"Địa chỉ"}
//               placeholder={"Nhập địa chỉ kho"}
//               type="text"
//               withAsterisk
//               {...form.getInputProps("addr")}
//             />
//           </Grid.Col>
//         </Grid>

//         <Grid>
//           <Grid.Col span={6}>
//             <TextInput
//               label={"Điện thoại"}
//               placeholder={"Nhập số điện thoại"}
//               type="number"
//               withAsterisk
//               {...form.getInputProps("phone")}
//             />
//           </Grid.Col>
//           <Grid.Col span={6}>
//             <TextInput
//               label={"Fax"}
//               placeholder={"Nhập fax"}
//               type="number"
//               {...form.getInputProps("fax")}
//             />
//           </Grid.Col>
//         </Grid>

//         <Grid>
//           <Grid.Col span={6}>
//             <TextInput
//               label={"Mã vùng"}
//               placeholder={"Nhập mã vùng"}
//               type="text"
//               {...form.getInputProps("positionId")}
//             />
//           </Grid.Col>
//           <Grid.Col span={6}>
//             <TextInput
//               label={"Trung tâm khác"}
//               placeholder={"Nhập trung tâm"}
//               type="text"
//               {...form.getInputProps("oldInventoryCode")}
//             />
//           </Grid.Col>
//         </Grid>

//         <Grid align="center">
//           <Grid.Col span={6}>
//             <TextInput
//               label={"Mã kho ORC"}
//               placeholder={"Nhập mã kho"}
//               type="text"
//               {...form.getInputProps("codeoracle")}
//             />
//           </Grid.Col>
//           <Grid.Col span={6}>
//             <TextInput
//               label={"Tên loại kho"}
//               placeholder={"Nhập loại kho"}
//               type="number"
//               {...form.getInputProps("type")}
//             />
//           </Grid.Col>
//         </Grid>
//         <Grid align="center">
//           <Grid.Col span={12}>
//             <Textarea
//               label={"Ghi chú"}
//               placeholder="Nhập ghi chú"
//               w={"100%"}
//               {...form.getInputProps("note")}
//             />
//           </Grid.Col>
//           <Grid.Col span={12}>
//             <Checkbox label={"Sử dụng"} {...form.getInputProps("active")} />
//           </Grid.Col>
//         </Grid>

//         <Group
//           justify="end"
//           mt="xs"
//           style={{
//             position: "sticky",
//             bottom: 0,
//             backgroundColor: "white",
//           }}
//         >
//           <Button
//             type="button"
//             color="gray"
//             loading={visible}
//             onClick={() => {
//               modals.closeAll();
//             }}
//             leftSection={!visible ? <IconWindow size={18} /> : undefined}
//           >
//             Đóng
//           </Button>
//           <Button
//             type="submit"
//             color={sky_blue.base}
//             loading={visible}
//             leftSection={!visible ? <IconCheck size={18} /> : undefined}
//           >
//             Lưu
//           </Button>
//           <></>
//         </Group>
//       </Box>
//     </>
//   );
// };

// export default CreateDataView;

// type CreateDataViewProps = {
//   onClose: any;
// };
