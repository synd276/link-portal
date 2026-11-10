import { Metadata } from "next";
import { getCurrentUser, getAdminUsers } from "@/lib/data";
import { AdminUsersTable } from "@/components/admin/admin-users-table";

export const metadata: Metadata = {
  title: "Quản lý Người dùng | Admin Hệ thống quản lý đa chức năng",
  description: "Quản trị danh sách người dùng và phân quyền quản trị",
};

export default async function AdminUsersPage() {
  const [currentUser, users] = await Promise.all([
    getCurrentUser(),
    getAdminUsers(),
  ]);

  return (
    <AdminUsersTable
      initialUsers={users}
      currentAdminId={currentUser?.id}
    />
  );
}
