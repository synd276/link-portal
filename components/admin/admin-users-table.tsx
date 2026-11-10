"use client";

import * as React from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Profile, UserRole } from "@/types/database";
import { updateUserRoleAction, deleteUserProfileAction } from "@/app/actions/admin";
import { formatDateTime } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminUsersTableProps {
  initialUsers: Profile[];
  currentAdminId?: string | null;
}

export function AdminUsersTable({
  initialUsers,
  currentAdminId,
}: AdminUsersTableProps) {
  const [users, setUsers] = React.useState<Profile[]>(initialUsers);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  const [roleTarget, setRoleTarget] = React.useState<{ user: Profile; newRole: UserRole } | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Profile | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const filtered = React.useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        (u.full_name && u.full_name.toLowerCase().includes(q)) ||
        u.id.toLowerCase().includes(q);

      const matchRole = roleFilter === "all" || u.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRoleChangeConfirm = async () => {
    if (!roleTarget) return;
    setIsUpdating(true);
    try {
      const res = await updateUserRoleAction(roleTarget.user.id, roleTarget.newRole);
      if (!res.success) {
        toast.error(res.error || "Không thể cập nhật vai trò người dùng");
      } else {
        toast.success(`Đã cập nhật vai trò thành công cho "${roleTarget.user.full_name || 'Người dùng'}"`);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === roleTarget.user.id ? { ...u, role: roleTarget.newRole } : u
          )
        );
        setRoleTarget(null);
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!deleteTarget) return;
    setIsUpdating(true);
    try {
      const res = await deleteUserProfileAction(deleteTarget.id);
      if (!res.success) {
        toast.error(res.error || "Không thể xóa hồ sơ người dùng");
      } else {
        toast.success(`Đã xóa hồ sơ người dùng "${deleteTarget.full_name || 'Người dùng'}"`);
        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Quản lý Người dùng</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản trị tài khoản, kiểm tra thông tin và phân quyền vai trò người dùng
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-card p-3 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo họ tên hoặc UUID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-9"
          />
        </div>

        <Select
          value={roleFilter}
          onValueChange={(val) => {
            setRoleFilter(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            <SelectItem value="admin">Quản trị viên (Admin)</SelectItem>
            <SelectItem value="user">Người dùng (User)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Người dùng</th>
                <th className="py-3 px-4">UUID</th>
                <th className="py-3 px-4">Vai trò</th>
                <th className="py-3 px-4">Ngày tham gia</th>
                <th className="py-3 px-4 text-right">Phân quyền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((u) => {
                const isSelf = u.id === currentAdminId;
                const isAdmin = u.role === "admin";

                return (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={u.avatar_url || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {u.full_name ? u.full_name.charAt(0).toUpperCase() : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">
                            {u.full_name || "Chưa đặt tên"}{" "}
                            {isSelf && (
                              <span className="text-[10px] text-muted-foreground">(Bạn)</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                      {u.id.substring(0, 13)}...
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={isAdmin ? "default" : "secondary"}
                        className={isAdmin ? "bg-amber-500 hover:bg-amber-600" : ""}
                      >
                        {isAdmin ? "Admin" : "User"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {formatDateTime(u.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isAdmin ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isSelf}
                            onClick={() => setRoleTarget({ user: u, newRole: "user" })}
                            className="h-7 text-xs"
                          >
                            Hạ quyền User
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setRoleTarget({ user: u, newRole: "admin" })}
                            className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            Thăng cấp Admin
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isSelf}
                          onClick={() => setDeleteTarget(u)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          title="Xóa hồ sơ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-3 border-t bg-muted/20 text-xs text-muted-foreground">
          <span>
            Hiển thị <strong>{paginated.length}</strong> trên <strong>{filtered.length}</strong> người dùng (Trang {currentPage} / {totalPages})
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Role Change Confirmation Dialog */}
      <Dialog open={Boolean(roleTarget)} onOpenChange={(open) => !open && setRoleTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận thay đổi vai trò</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đổi vai trò của &quot;{roleTarget?.user.full_name || 'Người dùng'}&quot; thành{" "}
              <strong>{roleTarget?.newRole === "admin" ? "Quản trị viên (Admin)" : "Người dùng thường (User)"}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRoleTarget(null)} disabled={isUpdating}>
              Hủy
            </Button>
            <Button onClick={handleRoleChangeConfirm} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang cập nhật...
                </>
              ) : (
                "Xác nhận thay đổi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa hồ sơ người dùng &quot;{deleteTarget?.full_name || 'Người dùng'}&quot;?
              Thao tác này sẽ gỡ bỏ dữ liệu cá nhân của tài khoản này khỏi hệ thống.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isUpdating}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteUserConfirm} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xóa...
                </>
              ) : (
                "Xác nhận xóa"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
