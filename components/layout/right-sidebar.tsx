"use client";

import * as React from "react";
import {
  StickyNote,
  Clock,
  Star,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Website, UserNote } from "@/types/database";
import { createNoteAction, updateNoteAction, deleteNoteAction } from "@/app/actions/notes";
import { recordVisitAction } from "@/app/actions/websites";
import { getDomainFromUrl, getFaviconUrl, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RightSidebarProps {
  initialNotes: UserNote[];
  recentVisits: { id: string; visited_at: string; website: Website }[];
  favoriteWebsites: Website[];
  visible: boolean;
  onClose: () => void;
}

export function RightSidebar({
  initialNotes,
  recentVisits,
  favoriteWebsites,
  visible,
  onClose,
}: RightSidebarProps) {
  const [notes, setNotes] = React.useState<UserNote[]>(initialNotes);
  const [activeTab, setActiveTab] = React.useState<string>("notes");

  // Note dialog state
  const [noteDialogOpen, setNoteDialogOpen] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<UserNote | null>(null);
  const [noteTitle, setNoteTitle] = React.useState("");
  const [noteContent, setNoteContent] = React.useState("");
  const [isSavingNote, setIsSavingNote] = React.useState(false);

  const handleOpenAddNote = () => {
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setNoteDialogOpen(true);
  };

  const handleOpenEditNote = (n: UserNote) => {
    setEditingNote(n);
    setNoteTitle(n.title);
    setNoteContent(n.content);
    setNoteDialogOpen(true);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề ghi chú");
      return;
    }

    setIsSavingNote(true);
    try {
      if (editingNote) {
        const res = await updateNoteAction(editingNote.id, {
          title: noteTitle,
          content: noteContent,
        });
        if (!res.success) {
          toast.error(res.error || "Không thể cập nhật ghi chú");
        } else {
          toast.success("Đã cập nhật ghi chú");
          setNotes((prev) =>
            prev.map((n) => (n.id === editingNote.id ? (res.data as UserNote) : n))
          );
          setNoteDialogOpen(false);
        }
      } else {
        const res = await createNoteAction({
          title: noteTitle,
          content: noteContent,
        });
        if (!res.success) {
          toast.error(res.error || "Không thể tạo ghi chú");
        } else {
          toast.success("Đã tạo ghi chú thành công");
          setNotes((prev) => [res.data as UserNote, ...prev]);
          setNoteDialogOpen(false);
        }
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const res = await deleteNoteAction(id);
      if (!res.success) {
        toast.error(res.error || "Không thể xóa ghi chú");
      } else {
        toast.success("Đã xóa ghi chú");
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch {
      toast.error("Có lỗi xảy ra khi xóa");
    }
  };

  const handleVisit = (websiteId: string) => {
    recordVisitAction(websiteId).catch(() => {});
  };

  if (!visible) return null;

  return (
    <aside className="w-80 h-full border-l bg-card flex flex-col shrink-0">
      {/* Header */}
      <div className="h-16 px-4 border-b flex items-center justify-between">
        <span className="font-semibold text-sm text-foreground">
          Bảng tiện ích cá nhân
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Đóng tiện ích"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="p-3 flex-1 flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid grid-cols-3 w-full h-8 text-xs">
            <TabsTrigger value="notes" className="text-xs gap-1">
              <StickyNote className="h-3 w-3" /> Ghi chú
            </TabsTrigger>
            <TabsTrigger value="recent" className="text-xs gap-1">
              <Clock className="h-3 w-3" /> Lịch sử
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs gap-1">
              <Star className="h-3 w-3" /> Yêu thích
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: NOTES */}
          <TabsContent value="notes" className="flex-1 flex flex-col min-h-0 mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                {notes.length} ghi chú
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenAddNote}
                className="h-7 text-xs gap-1"
              >
                <Plus className="h-3 w-3" /> Thêm ghi chú
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="group p-3 rounded-lg border bg-background/50 hover:bg-background hover:shadow-2xs transition-all space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-xs text-foreground line-clamp-1">
                      {note.title}
                    </h4>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditNote(note)}
                        className="p-1 hover:text-primary text-muted-foreground rounded"
                        title="Sửa"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 hover:text-destructive text-muted-foreground rounded"
                        title="Xóa"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  {note.content && (
                    <p className="text-[11px] text-muted-foreground line-clamp-3 whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground/70 pt-1">
                    {formatDateTime(note.updated_at)}
                  </p>
                </div>
              ))}

              {notes.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                  <StickyNote className="h-8 w-8 mx-auto opacity-30" />
                  <p>Chưa có ghi chú nào.</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenAddNote}
                    className="text-xs text-primary"
                  >
                    Tạo ghi chú mới
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: RECENT VISITS */}
          <TabsContent value="recent" className="flex-1 flex flex-col min-h-0 mt-3 space-y-2">
            <span className="text-xs text-muted-foreground font-medium">
              10 website truy cập gần nhất
            </span>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {recentVisits.map((visit) => {
                const w = visit.website;
                if (!w) return null;
                const domain = getDomainFromUrl(w.url);
                const favicon = getFaviconUrl(w.url, w.favicon_url);

                return (
                  <a
                    key={visit.id}
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleVisit(w.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg border bg-background/50 hover:bg-background hover:border-primary/40 transition-colors group"
                  >
                    <div className="h-7 w-7 rounded bg-muted/60 p-1 flex items-center justify-center shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={favicon}
                        alt=""
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {w.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {domain}
                      </p>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary shrink-0" />
                  </a>
                );
              })}

              {recentVisits.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                  <Clock className="h-8 w-8 mx-auto opacity-30" />
                  <p>Chưa có lịch sử truy cập.</p>
                  <p className="text-[11px] text-muted-foreground/70">
                    Khi bạn mở một liên kết từ hệ thống, lịch sử sẽ xuất hiện ở đây.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 3: FAVORITES */}
          <TabsContent value="favorites" className="flex-1 flex flex-col min-h-0 mt-3 space-y-2">
            <span className="text-xs text-muted-foreground font-medium">
              {favoriteWebsites.length} website yêu thích
            </span>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {favoriteWebsites.map((fav) => {
                const domain = getDomainFromUrl(fav.url);
                const favicon = getFaviconUrl(fav.url, fav.favicon_url);

                return (
                  <a
                    key={fav.id}
                    href={fav.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleVisit(fav.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg border bg-background/50 hover:bg-background hover:border-primary/40 transition-colors group"
                  >
                    <div className="h-7 w-7 rounded bg-muted/60 p-1 flex items-center justify-center shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={favicon}
                        alt=""
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {fav.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {domain}
                      </p>
                    </div>
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                  </a>
                );
              })}

              {favoriteWebsites.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                  <Star className="h-8 w-8 mx-auto opacity-30" />
                  <p>Chưa có website yêu thích.</p>
                  <p className="text-[11px] text-muted-foreground/70">
                    Nhấn vào biểu tượng ngôi sao trên thẻ website để lưu vào yêu thích.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Note Modal Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingNote ? "Chỉnh sửa ghi chú" : "Tạo ghi chú mới"}
            </DialogTitle>
            <DialogDescription>
              Lưu lại các ghi chú nhanh, mã bảo mật hoặc nhắc nhở cá nhân
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveNote} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Input
                placeholder="Tiêu đề ghi chú..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                disabled={isSavingNote}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Textarea
                placeholder="Nội dung chi tiết..."
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                disabled={isSavingNote}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setNoteDialogOpen(false)}
                disabled={isSavingNote}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSavingNote}>
                {isSavingNote ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...
                  </>
                ) : (
                  "Lưu ghi chú"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
