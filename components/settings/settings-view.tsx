"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Lock, Palette } from "lucide-react";
import { toast } from "sonner";

import { Profile, UserSettings } from "@/types/database";
import { profileSchema, changePasswordSchema, type ProfileInput, type ChangePasswordInput } from "@/lib/validations";
import { updateProfileAction, changePasswordAction } from "@/app/actions/auth";
import { updateUserSettingsAction } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SettingsViewProps {
  profile: Profile | null;
  settings: UserSettings | null;
  userEmail?: string | null;
}

export function SettingsView({ profile, settings, userEmail }: SettingsViewProps) {
  const { theme, setTheme } = useTheme();

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      avatar_url: profile?.avatar_url || "",
    },
  });

  const onUpdateProfile = async (values: ProfileInput) => {
    try {
      const res = await updateProfileAction(values);
      if (!res.success) {
        toast.error(res.error || "Không thể cập nhật hồ sơ");
      } else {
        toast.success("Hồ sơ đã được cập nhật thành công");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onChangePassword = async (values: ChangePasswordInput) => {
    try {
      const res = await changePasswordAction(values);
      if (!res.success) {
        toast.error(res.error || "Không thể đổi mật khẩu");
      } else {
        toast.success("Mật khẩu đã được thay đổi thành công");
        resetPasswordForm();
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  // Layout Preferences
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(
    settings?.sidebar_collapsed ?? false
  );
  const [rightSidebarVisible, setRightSidebarVisible] = React.useState(
    settings?.right_sidebar_visible ?? true
  );

  const handleTogglePref = async (key: "sidebar_collapsed" | "right_sidebar_visible", val: boolean) => {
    if (key === "sidebar_collapsed") setSidebarCollapsed(val);
    if (key === "right_sidebar_visible") setRightSidebarVisible(val);

    try {
      const res = await updateUserSettingsAction({ [key]: val });
      if (!res.success) {
        toast.error("Không thể lưu cài đặt giao diện");
      } else {
        toast.success("Đã lưu tùy chọn giao diện");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    try {
      await updateUserSettingsAction({ theme: newTheme });
      toast.success(`Đã chuyển sang giao diện ${newTheme === "dark" ? "Tối" : newTheme === "light" ? "Sáng" : "Hệ thống"}`);
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Cài đặt</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Quản lý tài khoản cá nhân, mật khẩu và tùy biến giao diện của bạn
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="profile" className="gap-1.5 text-xs sm:text-sm">
            <User className="h-4 w-4" /> Tài khoản
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5 text-xs sm:text-sm">
            <Palette className="h-4 w-4" /> Giao diện
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs sm:text-sm">
            <Lock className="h-4 w-4" /> Bảo mật
          </TabsTrigger>
        </TabsList>

        {/* 1. PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Cập nhật họ tên và ảnh đại diện hiển thị trên Link Portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <Avatar className="h-16 w-16 rounded-xl border">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary rounded-xl">
                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-semibold text-base">{profile?.full_name || "Chưa cập nhật tên"}</p>
                  <p className="text-xs text-muted-foreground">{userEmail || "Tài khoản người dùng"}</p>
                  <div className="pt-1">
                    <Badge variant={profile?.role === "admin" ? "default" : "secondary"} className="capitalize">
                      {profile?.role === "admin" ? "Quản trị viên (Admin)" : "Thành viên (User)"}
                    </Badge>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="full_name">Họ và tên</Label>
                  <Input
                    id="full_name"
                    disabled={isSubmittingProfile}
                    {...registerProfile("full_name")}
                    className={profileErrors.full_name ? "border-destructive" : ""}
                  />
                  {profileErrors.full_name && (
                    <p className="text-xs text-destructive">{profileErrors.full_name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="avatar_url">Avatar URL</Label>
                  <Input
                    id="avatar_url"
                    placeholder="https://.../avatar.jpg"
                    disabled={isSubmittingProfile}
                    {...registerProfile("avatar_url")}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Nhập liên kết hình ảnh avatar trực tiếp để hiển thị ảnh đại diện cá nhân
                  </p>
                </div>

                <Button type="submit" disabled={isSubmittingProfile}>
                  {isSubmittingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. APPEARANCE TAB */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chế độ hiển thị (Theme)</CardTitle>
              <CardDescription>
                Tùy chỉnh giao diện sáng/tối để phù hợp với môi trường làm việc
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleThemeChange("light")}
                  className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
                    theme === "light"
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                      : "hover:border-foreground/30 bg-card"
                  }`}
                >
                  <div className="h-6 w-6 rounded-md bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
                    ☀
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Giao diện Sáng (Light)</p>
                    <p className="text-xs text-muted-foreground">Nền trắng tinh tế, sắc nét</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleThemeChange("dark")}
                  className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
                    theme === "dark"
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                      : "hover:border-foreground/30 bg-card"
                  }`}
                >
                  <div className="h-6 w-6 rounded-md bg-purple-500/20 text-purple-600 flex items-center justify-center font-bold">
                    🌙
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Giao diện Tối (Dark)</p>
                    <p className="text-xs text-muted-foreground">Dịu mắt khi làm việc ban đêm</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleThemeChange("system")}
                  className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
                    theme === "system"
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                      : "hover:border-foreground/30 bg-card"
                  }`}
                >
                  <div className="h-6 w-6 rounded-md bg-blue-500/20 text-blue-600 flex items-center justify-center font-bold">
                    ⚙
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Tự động (System)</p>
                    <p className="text-xs text-muted-foreground">Theo cài đặt hệ điều hành</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bố cục bảng điều khiển</CardTitle>
              <CardDescription>
                Tùy chọn trạng thái mặc định của thanh điều hướng và cột tiện ích
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="sidebar_collapsed_pref" className="cursor-pointer font-medium">
                    Thu gọn thanh điều hướng bên trái
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Mặc định hiển thị sidebar bên trái dưới dạng icon thu nhỏ
                  </p>
                </div>
                <Switch
                  id="sidebar_collapsed_pref"
                  checked={sidebarCollapsed}
                  onCheckedChange={(val) => handleTogglePref("sidebar_collapsed", val)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="right_sidebar_pref" className="cursor-pointer font-medium">
                    Hiển thị cột tiện ích bên phải
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Mặc định mở cột ghi chú nhanh và lịch sử truy cập trên màn hình lớn
                  </p>
                </div>
                <Switch
                  id="right_sidebar_pref"
                  checked={rightSidebarVisible}
                  onCheckedChange={(val) => handleTogglePref("right_sidebar_visible", val)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. SECURITY TAB */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>
                Đảm bảo sử dụng mật khẩu mạnh với ít nhất 6 ký tự
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <Label htmlFor="new_password">Mật khẩu mới</Label>
                  <Input
                    id="new_password"
                    type="password"
                    placeholder="••••••••"
                    disabled={isSubmittingPassword}
                    {...registerPassword("password")}
                    className={passwordErrors.password ? "border-destructive" : ""}
                  />
                  {passwordErrors.password && (
                    <p className="text-xs text-destructive">{passwordErrors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm_password">Xác nhận mật khẩu mới</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    placeholder="••••••••"
                    disabled={isSubmittingPassword}
                    {...registerPassword("confirmPassword")}
                    className={passwordErrors.confirmPassword ? "border-destructive" : ""}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-xs text-destructive">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isSubmittingPassword}>
                  {isSubmittingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật mật khẩu"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
