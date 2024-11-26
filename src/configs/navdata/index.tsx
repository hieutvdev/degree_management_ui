import {
  IconBuildingCommunity,
  IconHome,
  IconCertificate,
  IconSchool,
  IconBuildingWarehouse,
  IconUserCog,
} from "@tabler/icons-react";

export const router = [
  {
    label: "Trang chủ",
    icon: IconHome,
    initiallyOpened: true,
  },
  {
    label: "Quản lý danh mục",
    icon: IconBuildingCommunity,
    initiallyOpened: true,
    links: [
      {
        label: "Danh sách khoa",
        link: "/faculty",
      },
      {
        label: "Danh sách ngành",
        link: "/major",
      },
      // {
      //   label: "Danh sách chuyên ngành",
      //   link: "/specialization",
      // },
      {
        label: "Đợt tốt nghiệp",
        link: "/period",
      },
      {
        label: "Năm tốt nghiệp",
        link: "/year-graduation",
      },
    ],
  },
  {
    label: "Sinh viên",
    icon: IconSchool,
    initiallyOpened: true,
    links: [{ label: "Sinh viên tốt nghiệp", link: "/student-graduated" }],
  },
  {
    label: "Văn bằng",
    icon: IconCertificate,
    initiallyOpened: true,
    links: [
      { label: "Loại văn bằng", link: "/degree-type" },
      { label: "Quản lý văn bằng", link: "/degree-management" },
      // { label: "Cấp phát văn bằng tốt nghiệp", link: "/issue-diplomas" },
    ],
  },
  {
    label: "Kho",
    icon: IconBuildingWarehouse,
    initiallyOpened: true,
    links: [
      { label: "Kho văn bằng", link: "/warehouse" },
      { label: "Nhập kho văn bằng", link: "/inward" },
      { label: "Quản lý số lượng phôi", link: "/inventory" },
      { label: "Phiếu đề xuất", link: "/proposal-form" },
      { label: "Phiếu cấp phôi", link: "/embryo-issuance" },
      { label: "Phiếu xuất phôi", link: "/embryo-export" },
    ],
  },
  {
    label: "Quản trị",
    icon: IconUserCog,
    initiallyOpened: true,
    links: [
      { label: "Chức danh", link: "/role" },
      { label: "Người dùng", link: "/users" },
    ],
  },
];
