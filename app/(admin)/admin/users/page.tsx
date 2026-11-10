import { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentUser, getAdminUsers } from "@/lib/data";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { AdminUsersSkeleton } from "@/components/skeletons/admin-skeletons";

export const metadata: Metadata = {
  title: "Quản lý Người dùng | Admin Hệ thống quản lý đa chức năng",
  description: "Quản trị danh sách người dùng và phân quyền quản trị",
};

async function AdminUsersData() {
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

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<AdminUsersSkeleton />}>
      <AdminUsersData />
    </Suspense>
  );
}
