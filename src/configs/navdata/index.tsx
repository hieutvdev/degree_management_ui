import {
  IconBuildingCommunity,
  IconHome,
  IconCertificate,
  IconSchool,
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
        label: "Danh sách chuyên ngành",
        link: "/major",
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
];
