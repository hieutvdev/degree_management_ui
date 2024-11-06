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
      {
        label: "Danh sách chuyên ngành",
        link: "/specialization",
      },
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
    ],
  },
  {
    label: "Kho",
    icon: IconBuildingWarehouse,
    initiallyOpened: true,
    links: [
      { label: "Kho văn bằng", link: "/warehouse" },
      { label: "Quản lý số lượng phôi", link: "/inventory" },
    ],
  },
  {
    label: "Quản trị",
    icon: IconUserCog,
    initiallyOpened: true,
  },
];
