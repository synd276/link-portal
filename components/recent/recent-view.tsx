"use client";

import * as React from "react";
import { Clock, Globe, ArrowUpRight } from "lucide-react";
import { Website } from "@/types/database";
import { formatDateTime, getDomainFromUrl, getFaviconUrl } from "@/lib/utils";
import { recordVisitAction } from "@/app/actions/websites";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecentItem {
  id: string;
  visited_at: string;
  website: Website;
}

interface RecentViewProps {
  visits: RecentItem[];
  recentAdded: Website[];
}

export function RecentView({ visits, recentAdded }: RecentViewProps) {
  const handleOpen = (wId: string) => {
    recordVisitAction(wId).catch(() => {});
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Lịch sử truy cập & Mới thêm</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Theo dõi các liên kết bạn đã mở gần đây và các website mới được thêm vào hệ thống
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: Visits history */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-base">Website truy cập gần nhất</h3>
          </div>

          <div className="space-y-2.5">
            {visits.map((item) => {
              const w = item.website;
              if (!w) return null;
              const domain = getDomainFromUrl(w.url);
              const favicon = getFaviconUrl(w.url, w.favicon_url);

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border bg-card hover:border-primary/40 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-muted/60 p-1 flex items-center justify-center shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={favicon}
                        alt=""
                        className="h-full w-full object-contain"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <a
                        href={w.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleOpen(w.id)}
                        className="font-medium text-sm text-foreground hover:text-primary transition-colors truncate block"
                      >
                        {w.name}
                      </a>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span className="truncate">{domain}</span>
                        <span>•</span>
                        <span className="shrink-0">{formatDateTime(item.visited_at)}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" asChild className="shrink-0 h-8 gap-1 text-xs">
                    <a
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleOpen(w.id)}
                    >
                      Mở <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              );
            })}

            {visits.length === 0 && (
              <div className="p-8 text-center rounded-xl border border-dashed bg-muted/20 text-muted-foreground text-sm">
                Chưa có lượt truy cập nào được ghi nhận.
              </div>
            )}
          </div>
        </div>

        {/* Right column: Recently added websites */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-base">Website mới thêm trên hệ thống</h3>
          </div>

          <div className="space-y-2.5">
            {recentAdded.map((w) => {
              const domain = getDomainFromUrl(w.url);
              const favicon = getFaviconUrl(w.url, w.favicon_url);

              return (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border bg-card hover:border-primary/40 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-muted/60 p-1 flex items-center justify-center shrink-0">
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
                    <div className="min-w-0">
                      <a
                        href={w.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleOpen(w.id)}
                        className="font-medium text-sm text-foreground hover:text-primary transition-colors truncate block"
                      >
                        {w.name}
                      </a>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span className="truncate">{domain}</span>
                        {w.category && (
                          <>
                            <span>•</span>
                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                              {w.category.name}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" asChild className="shrink-0 h-8 gap-1 text-xs">
                    <a
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleOpen(w.id)}
                    >
                      Mở <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              );
            })}

            {recentAdded.length === 0 && (
              <div className="p-8 text-center rounded-xl border border-dashed bg-muted/20 text-muted-foreground text-sm">
                Chưa có website mới nào.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
