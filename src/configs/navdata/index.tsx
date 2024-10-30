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
        link: "/category-management/faculty-management",
      },
      {
        label: "Danh sách chuyên ngành",
        link: "/category-management/major-management",
      },
    ],
  },
  {
    label: "Sinh viên",
    icon: IconSchool,
    initiallyOpened: true,
    links: [
      { label: "Sinh viên tốt nghiệp", link: "/student/student-graduated" },
    ],
  },
  {
    label: "Văn bằng",
    icon: IconCertificate,
    initiallyOpened: true,
    links: [{ label: "Loại văn bằng", link: "/degree/degree-type" }],
  },
];
