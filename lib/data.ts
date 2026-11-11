import { getDeterministicWebsiteUuid } from "@/lib/utils";
import { cache } from "react";
import { cookies } from "next/headers";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  Profile,
  Category,
  Website,
  UserSettings,
  UserNote,
  DashboardStats,
  AdminStats,
} from "@/types/database";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    "id": "11111111-1111-1111-1111-111111111101",
    "name": "AI",
    "description": "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
    "icon": "Bot",
    "is_global": true,
    "user_id": null,
    "sort_order": 1,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "website_count": 12
  },
  {
    "id": "11111111-1111-1111-1111-111111111102",
    "name": "Đảng",
    "description": "Hệ thống các cơ quan, báo chí và thông tin của Đảng",
    "icon": "Star",
    "is_global": true,
    "user_id": null,
    "sort_order": 2,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "website_count": 12
  },
  {
    "id": "11111111-1111-1111-1111-111111111103",
    "name": "Chính quyền",
    "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
    "icon": "Building2",
    "is_global": true,
    "user_id": null,
    "sort_order": 3,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "website_count": 44
  }
];

export const DEFAULT_WEBSITES: Website[] = [
  {
    "id": "33333333-0001-0000-0000-000000000001",
    "name": "CHATGPT",
    "url": "https://chatgpt.com",
    "description": "Trợ lý AI đàm thoại hàng đầu của OpenAI",
    "favicon_url": "https://chatgpt.com/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111101",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 1,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111101",
      "name": "AI",
      "description": "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
      "icon": "Bot",
      "is_global": true,
      "user_id": null,
      "sort_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0001-0000-0000-000000000002",
    "name": "CLAUDE AI",
    "url": "https://claude.ai",
    "description": "Trợ lý AI thông minh từ Anthropic",
    "favicon_url": "https://claude.ai/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111101",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 2,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111101",
      "name": "AI",
      "description": "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
      "icon": "Bot",
      "is_global": true,
      "user_id": null,
      "sort_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0001-0000-0000-000000000003",
    "name": "GOOGLE GEMINI",
    "url": "https://gemini.google.com",
    "description": "Mô hình AI đa phương thức thông minh của Google",
    "favicon_url": "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
    "category_id": "11111111-1111-1111-1111-111111111101",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 3,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111101",
      "name": "AI",
      "description": "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
      "icon": "Bot",
      "is_global": true,
      "user_id": null,
      "sort_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0001-0000-0000-000000000004",
    "name": "MICROSOFT COPILOT",
    "url": "https://copilot.microsoft.com",
    "description": "Trợ lý AI hỗ trợ công việc từ Microsoft",
    "favicon_url": "https://copilot.microsoft.com/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111101",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 4,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111101",
      "name": "AI",
      "description": "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
      "icon": "Bot",
      "is_global": true,
      "user_id": null,
      "sort_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0001-0000-0000-000000000005",
    "name": "DEEPSEEK",
    "url": "https://chat.deepseek.com",
    "description": "Mô hình AI suy luận và lập trình mã nguồn mở thế hệ mới",
    "favicon_url": "https://chat.deepseek.com/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111101",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 5,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111101",
      "name": "AI",
      "description": "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
      "icon": "Bot",
      "is_global": true,
      "user_id": null,
      "sort_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0001-0000-0000-000000000006",
    "name": "PERPLEXITY AI",
    "url": "https://www.perplexity.ai",
    "description": "Công cụ tìm kiếm thông minh và trích dẫn nguồn bằng AI",
    "favicon_url": "https://www.perplexity.ai/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111101",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 6,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111101",
      "name": "AI",
      "description": "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
      "icon": "Bot",
      "is_global": true,
      "user_id": null,
      "sort_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0001-0000-0000-000000000007",
    "name": "MIDJOURNEY",
    "url": "https://www.midjourney.com",
    "description": "Sáng tạo nghệ thuật và tạo ảnh chuyên nghiệp bằng AI",
    "favicon_url": "https://www.midjourney.com/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111101",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 7,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111101",
      "name": "AI",
      "description": "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
      "icon": "Bot",
      "is_global": true,
      "user_id": null,
      "sort_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0001-0000-0000-000000000008",
    "name": "POE AI",
    "url": "https://poe.com",
    "description": "Nền tảng trải nghiệm đa mô hình AI từ Quora",
    "favicon_url": "https://poe.com/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111101",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 8,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111101",
      "name": "AI",
      "description": "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
      "icon": "Bot",
      "is_global": true,
      "user_id": null,
      "sort_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0001-0000-0000-000000000009",
    "name": "CANVA AI",
    "url": "https://www.canva.com",
    "description": "Công cụ thiết kế đồ họa với tính năng AI Magic Studio",
    "favicon_url": "https://www.canva.com/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111101",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 9,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111101",
      "name": "AI",
      "description": "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
      "icon": "Bot",
      "is_global": true,
      "user_id": null,
      "sort_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0001-0000-0000-00000000000a",
    "name": "SUNO AI",
    "url": "https://suno.com",
    "description": "Tạo nhạc và bài hát tự động bằng trí tuệ nhân tạo",
    "favicon_url": "https://suno.com/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111101",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 10,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111101",
      "name": "AI",
      "description": "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
      "icon": "Bot",
      "is_global": true,
      "user_id": null,
      "sort_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0001-0000-0000-00000000000b",
    "name": "GOOGLE AI STUDIO",
    "url": "https://aistudio.google.com",
    "description": "Môi trường phát triển và thử nghiệm các mô hình Gemini",
    "favicon_url": "https://aistudio.google.com/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111101",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 11,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111101",
      "name": "AI",
      "description": "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
      "icon": "Bot",
      "is_global": true,
      "user_id": null,
      "sort_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0001-0000-0000-00000000000c",
    "name": "PHIND",
    "url": "https://www.phind.com",
    "description": "Công cụ tìm kiếm AI chuyên sâu dành cho lập trình viên",
    "favicon_url": "https://www.phind.com/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111101",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 12,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111101",
      "name": "AI",
      "description": "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
      "icon": "Bot",
      "is_global": true,
      "user_id": null,
      "sort_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0002-0000-0000-000000000001",
    "name": "BÁO ĐIỆN TỬ ĐẢNG CỘNG SẢN VIỆT NAM",
    "url": "https://dangcongsan.vn",
    "description": "Tiếng nói của Đảng, Nhà nước và Nhân dân Việt Nam",
    "favicon_url": "https://dangcongsan.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111102",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 1,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111102",
      "name": "Đảng",
      "description": "Hệ thống các cơ quan, báo chí và thông tin của Đảng",
      "icon": "Star",
      "is_global": true,
      "user_id": null,
      "sort_order": 2,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0002-0000-0000-000000000002",
    "name": "TẠP CHÍ CỘNG SẢN",
    "url": "https://www.tapchicongsan.org.vn",
    "description": "Cơ quan lý luận chính trị của Ban Chấp hành Trung ương Đảng",
    "favicon_url": "https://www.tapchicongsan.org.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111102",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 2,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111102",
      "name": "Đảng",
      "description": "Hệ thống các cơ quan, báo chí và thông tin của Đảng",
      "icon": "Star",
      "is_global": true,
      "user_id": null,
      "sort_order": 2,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0002-0000-0000-000000000003",
    "name": "CỔNG THÔNG TIN ĐIỆN TỬ TRUNG ƯƠNG ĐẢNG",
    "url": "https://vpubdtw.vnpt.vn",
    "description": "Văn phòng Trung ương Đảng Cộng sản Việt Nam",
    "favicon_url": "https://vpubdtw.vnpt.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111102",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 3,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111102",
      "name": "Đảng",
      "description": "Hệ thống các cơ quan, báo chí và thông tin của Đảng",
      "icon": "Star",
      "is_global": true,
      "user_id": null,
      "sort_order": 2,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0002-0000-0000-000000000004",
    "name": "TƯ LIỆU VĂN KIỆN ĐẢNG",
    "url": "https://tulieuvankien.dangcongsan.vn",
    "description": "Hệ thống văn kiện, nghị quyết của Đảng qua các thời kỳ",
    "favicon_url": "https://tulieuvankien.dangcongsan.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111102",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 4,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111102",
      "name": "Đảng",
      "description": "Hệ thống các cơ quan, báo chí và thông tin của Đảng",
      "icon": "Star",
      "is_global": true,
      "user_id": null,
      "sort_order": 2,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0002-0000-0000-000000000005",
    "name": "TẠP CHÍ XÂY DỰNG ĐẢNG",
    "url": "https://xaydungdang.org.vn",
    "description": "Cơ quan của Ban Tổ chức Trung ương Đảng",
    "favicon_url": "https://xaydungdang.org.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111102",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 5,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111102",
      "name": "Đảng",
      "description": "Hệ thống các cơ quan, báo chí và thông tin của Đảng",
      "icon": "Star",
      "is_global": true,
      "user_id": null,
      "sort_order": 2,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0002-0000-0000-000000000006",
    "name": "BAN TUYÊN GIÁO TRUNG ƯƠNG",
    "url": "https://tuyengiao.vn",
    "description": "Trang thông tin điện tử Ban Tuyên giáo Trung ương",
    "favicon_url": "https://tuyengiao.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111102",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 6,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111102",
      "name": "Đảng",
      "description": "Hệ thống các cơ quan, báo chí và thông tin của Đảng",
      "icon": "Star",
      "is_global": true,
      "user_id": null,
      "sort_order": 2,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0002-0000-0000-000000000007",
    "name": "BÁO NHÂN DÂN",
    "url": "https://nhandan.vn",
    "description": "Cơ quan Trung ương của Đảng Cộng sản Việt Nam",
    "favicon_url": "https://nhandan.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111102",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 7,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111102",
      "name": "Đảng",
      "description": "Hệ thống các cơ quan, báo chí và thông tin của Đảng",
      "icon": "Star",
      "is_global": true,
      "user_id": null,
      "sort_order": 2,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0002-0000-0000-000000000008",
    "name": "HỌC VIỆN CHÍNH TRỊ QUỐC GIA HỒ CHÍ MINH",
    "url": "https://hcma.vn",
    "description": "Trung tâm quốc gia đào tạo cán bộ lãnh đạo, quản lý của Đảng",
    "favicon_url": "https://hcma.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111102",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 8,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111102",
      "name": "Đảng",
      "description": "Hệ thống các cơ quan, báo chí và thông tin của Đảng",
      "icon": "Star",
      "is_global": true,
      "user_id": null,
      "sort_order": 2,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0002-0000-0000-000000000009",
    "name": "CỔNG THÔNG TIN TỈNH ỦY ĐỒNG THÁP",
    "url": "https://dongthap.dcs.vn",
    "description": "Trang thông tin chính thức của Tỉnh ủy Đồng Tháp",
    "favicon_url": "https://dongthap.dcs.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111102",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 9,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111102",
      "name": "Đảng",
      "description": "Hệ thống các cơ quan, báo chí và thông tin của Đảng",
      "icon": "Star",
      "is_global": true,
      "user_id": null,
      "sort_order": 2,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0002-0000-0000-00000000000a",
    "name": "BAN DÂN VẬN TRUNG ƯƠNG",
    "url": "https://danvan.vn",
    "description": "Trang tin điện tử Ban Dân vận Trung ương",
    "favicon_url": "https://danvan.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111102",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 10,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111102",
      "name": "Đảng",
      "description": "Hệ thống các cơ quan, báo chí và thông tin của Đảng",
      "icon": "Star",
      "is_global": true,
      "user_id": null,
      "sort_order": 2,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0002-0000-0000-00000000000b",
    "name": "ỦY BAN KIỂM TRA TRUNG ƯƠNG",
    "url": "https://ubkttw.vn",
    "description": "Cơ quan kiểm tra, giám sát chuyên trách của Đảng",
    "favicon_url": "https://ubkttw.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111102",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 11,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111102",
      "name": "Đảng",
      "description": "Hệ thống các cơ quan, báo chí và thông tin của Đảng",
      "icon": "Star",
      "is_global": true,
      "user_id": null,
      "sort_order": 2,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0002-0000-0000-00000000000c",
    "name": "BAN NỘI CHÍNH TRUNG ƯƠNG",
    "url": "https://noichinh.vn",
    "description": "Cơ quan tham mưu về công tác nội chính và phòng chống tham nhũng",
    "favicon_url": "https://noichinh.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111102",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 12,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111102",
      "name": "Đảng",
      "description": "Hệ thống các cơ quan, báo chí và thông tin của Đảng",
      "icon": "Star",
      "is_global": true,
      "user_id": null,
      "sort_order": 2,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 12
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000001",
    "name": "CỔNG THÔNG TIN SỞ NÔNG NGHIỆP VÀ MÔI TRƯỜNG",
    "url": "https://snnmt.dongthap.gov.vn/trang-chu",
    "description": "Hệ thống chuyên ngành: CỔNG THÔNG TIN SỞ NÔNG NGHIỆP VÀ MÔI TRƯỜNG",
    "favicon_url": "https://www.google.com/s2/favicons?domain=snnmt.dongthap.gov.vn&sz=128",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 1,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000002",
    "name": "HỆ SINH THÁI NỀN TẢNG NÔNG NGHIỆP SỐ VIỆT NAM",
    "url": "https://vdapes.com",
    "description": "Hệ thống chuyên ngành: HỆ SINH THÁI NỀN TẢNG NÔNG NGHIỆP SỐ VIỆT NAM",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/rynan.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 2,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000003",
    "name": "HỆ THỐNG THÔNG TIN QUẢN LÝ ĐẤT ĐAI ILIS",
    "url": "https://ilis-cadas.dongthap.gov.vn",
    "description": "Hệ thống chuyên ngành: HỆ THỐNG THÔNG TIN QUẢN LÝ ĐẤT ĐAI ILIS",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/logoTNMT.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 3,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000004",
    "name": "CƠ SỞ DỮ LIỆU THỔ NHƯỠNG",
    "url": "https://csdldatnongnghiep.dongthap.gov.vn",
    "description": "Hệ thống chuyên ngành: CƠ SỞ DỮ LIỆU THỔ NHƯỠNG",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/csdldatnongnghiep.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 4,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000005",
    "name": "BAN CHỈ HUY PHÒNG CHỐNG THIÊN TAI VÀ TÌM KIẾM CỨU NẠN TỈNH ĐỒNG THÁP",
    "url": "https://phongchongthientaitiengiang.vn/",
    "description": "Hệ thống chuyên ngành: BAN CHỈ HUY PHÒNG CHỐNG THIÊN TAI VÀ TÌM KIẾM CỨU NẠN TỈNH ĐỒNG THÁP",
    "favicon_url": "https://gate.ttcntnmt.com.vn/img/thientai.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 5,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000006",
    "name": "HỆ THỐNG THÔNG TIN NÔNG NGHIỆP",
    "url": "https://htttnongnghiep.tiengiang.gov.vn/",
    "description": "Hệ thống chuyên ngành: HỆ THỐNG THÔNG TIN NÔNG NGHIỆP",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/hethongnongnghiep.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 6,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000007",
    "name": "CƠ SỞ DỮ LIỆU NÔNG NGHIỆP",
    "url": "https://dulieunongnghiep.dongthap.gov.vn/",
    "description": "Hệ thống chuyên ngành: CƠ SỞ DỮ LIỆU NÔNG NGHIỆP",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/dulieunongnghiep.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 7,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000008",
    "name": "HỆ THỐNG QUẢN LÝ THÔNG TIN TÀU CÁ",
    "url": "https://qltc.ttcntnmt.com.vn/",
    "description": "Hệ thống chuyên ngành: HỆ THỐNG QUẢN LÝ THÔNG TIN TÀU CÁ",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/tauca.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 8,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000009",
    "name": "PHẦN MỀM QUẢN LÝ DẠY NGHỀ",
    "url": "http://qldn.vpdttg.vn/Login.aspx",
    "description": "Hệ thống chuyên ngành: PHẦN MỀM QUẢN LÝ DẠY NGHỀ",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/edu.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 9,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000000a",
    "name": "PHẦN MỀM QUẢN LÝ TÀI NGUYÊN NƯỚC TỈNH ĐỒNG THÁP",
    "url": "https://tnn.ttcntnmt.com.vn",
    "description": "Hệ thống chuyên ngành: PHẦN MỀM QUẢN LÝ TÀI NGUYÊN NƯỚC TỈNH ĐỒNG THÁP",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/tainuoc.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 10,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000000b",
    "name": "PHẦN MỀM QUẢN LÝ DỮ LIỆU QUAN TRẮC TỰ ĐỘNG",
    "url": "https://dongthap-envisoft.tedp.vn",
    "description": "Hệ thống chuyên ngành: PHẦN MỀM QUẢN LÝ DỮ LIỆU QUAN TRẮC TỰ ĐỘNG",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/quantrac.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 11,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000000c",
    "name": "PHẦN MỀM GIÁM SÁT KHAI THÁC CÁT",
    "url": "https://ktks.ttcntnmt.com.vn",
    "description": "Hệ thống chuyên ngành: PHẦN MỀM GIÁM SÁT KHAI THÁC CÁT",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/cat.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 12,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000000d",
    "name": "PHẦN MỀM KHO HỒ SƠ CHỈNH LÝ",
    "url": "https://hs.ttcntnmt.com.vn",
    "description": "Hệ thống chuyên ngành: PHẦN MỀM KHO HỒ SƠ CHỈNH LÝ",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/tailieu.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 13,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000000e",
    "name": "PHẦN MỀM KHO LƯU TRỮ ĐIỆN TỬ (MỚI)",
    "url": "https://khosohoa.ttcntnmt.com.vn",
    "description": "Hệ thống chuyên ngành: PHẦN MỀM KHO LƯU TRỮ ĐIỆN TỬ (MỚI)",
    "favicon_url": "https://khosohoa.ttcntnmt.com.vn/lib/adminlte/dist/assets/bglogin/bg.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 14,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000000f",
    "name": "HỆ THỐNG KHAI THÁC TÀI LIỆU LƯU TRỮ ĐIỆN TỬ",
    "url": "https://digital.ttcntnmt.com.vn",
    "description": "Hệ thống chuyên ngành: HỆ THỐNG KHAI THÁC TÀI LIỆU LƯU TRỮ ĐIỆN TỬ",
    "favicon_url": "https://digital.ttcntnmt.com.vn/images/quoc-huy.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 15,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000010",
    "name": "PHẦN MỀM QUẢN LÝ ĐẤT CÔNG",
    "url": "http://ttcntnmt.com.vn:8060",
    "description": "Hệ thống chuyên ngành: PHẦN MỀM QUẢN LÝ ĐẤT CÔNG",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/datcong.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 16,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000011",
    "name": "PHẦN MỀM QUẢN LÝ ĐIỂM LẤY MẪU MÔI TRƯỜNG",
    "url": "https://dlm.ttcntnmt.com.vn",
    "description": "Hệ thống chuyên ngành: PHẦN MỀM QUẢN LÝ ĐIỂM LẤY MẪU MÔI TRƯỜNG",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/point.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 17,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000012",
    "name": "CƠ SỞ DỮ LIỆU MÔI TRƯỜNG",
    "url": "https://moitruong.ttcntnmt.com.vn",
    "description": "Hệ thống chuyên ngành: CƠ SỞ DỮ LIỆU MÔI TRƯỜNG",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/csdlmoitruong.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 18,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000013",
    "name": "CƠ SỞ DỮ LIỆU BIẾN ĐỔI KHÍ HẬU",
    "url": "https://bdkh.ttcntnmt.com.vn",
    "description": "Hệ thống chuyên ngành: CƠ SỞ DỮ LIỆU BIẾN ĐỔI KHÍ HẬU",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/baovemoitruong.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 19,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000014",
    "name": "CƠ SỞ DỮ LIỆU VỀ TÀI NGUYÊN, MÔI TRƯỜNG BIỂN VÀ HẢI ĐẢO TỈNH ĐỒNG THÁP",
    "url": "https://giaobien.vasi.gov.vn/",
    "description": "Hệ thống chuyên ngành: CƠ SỞ DỮ LIỆU VỀ TÀI NGUYÊN, MÔI TRƯỜNG BIỂN VÀ HẢI ĐẢO TỈNH ĐỒNG THÁP",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/biendao2.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 20,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000015",
    "name": "VBDLIS-HỆ THỐNG QUẢN LÝ ĐẤT ĐAI",
    "url": "https://tgi.mplis.gov.vn/dc/",
    "description": "Hệ thống chuyên ngành: VBDLIS-HỆ THỐNG QUẢN LÝ ĐẤT ĐAI",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/quanlydatdai.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 21,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000016",
    "name": "VBDLIS-KHAI THÁC DỮ LIỆU BẢN ĐỒ",
    "url": "https://tgi.mplis.gov.vn/bi/",
    "description": "Hệ thống chuyên ngành: VBDLIS-KHAI THÁC DỮ LIỆU BẢN ĐỒ",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/bando.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 22,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000017",
    "name": "THỐNG KÊ NÔNG NGHIỆP",
    "url": "https://tknn.ttcntnmt.com.vn/",
    "description": "Hệ thống chuyên ngành: THỐNG KÊ NÔNG NGHIỆP",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/edu.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 23,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000018",
    "name": "CÔNG CỤ KIỂM TRA THÔNG TIN, DỮ LIỆU TÀI NGUYÊN MÔI TRƯỜNG",
    "url": "https://check.ttcntnmt.com.vn/client",
    "description": "Hệ thống chuyên ngành: CÔNG CỤ KIỂM TRA THÔNG TIN, DỮ LIỆU TÀI NGUYÊN MÔI TRƯỜNG",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/quantrac.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 24,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000019",
    "name": "HỆ THỐNG GIÁM SÁT TÀU CÁ - VMS (CỤC THUỶ SẢN VÀ KIỂM NGƯ)",
    "url": "https://gstc.tongcucthuysan.gov.vn",
    "description": "Hệ thống chuyên ngành: HỆ THỐNG GIÁM SÁT TÀU CÁ - VMS (CỤC THUỶ SẢN VÀ KIỂM NGƯ)",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/tauca11.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 25,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000001a",
    "name": "HỆ THỐNG QUẢN LÝ TÀU CÁ CỤC THỦY SẢN VÀ KIỂM NGƯ VNFISBASE",
    "url": "http://vnf.tongcucthuysan.gov.vn/",
    "description": "Hệ thống chuyên ngành: HỆ THỐNG QUẢN LÝ TÀU CÁ CỤC THỦY SẢN VÀ KIỂM NGƯ VNFISBASE",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/tauca11.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 26,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000001b",
    "name": "THÔNG TIN DỊCH BỆNH ĐỘNG VẬT (THUỶ SẢN)",
    "url": "https://vahis.vn",
    "description": "Hệ thống chuyên ngành: THÔNG TIN DỊCH BỆNH ĐỘNG VẬT (THUỶ SẢN)",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/dichbenh.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 27,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000001c",
    "name": "CƠ SỞ DỮ LIỆU CÁ TRA",
    "url": "http://dulieucatra.mard.gov.vn",
    "description": "Hệ thống chuyên ngành: CƠ SỞ DỮ LIỆU CÁ TRA",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/quantrac.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 28,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000001d",
    "name": "CƠ SỞ DỮ LIỆU NUÔI TRỒNG THỦY SẢN",
    "url": "https://ntts.tongcucthuysan.gov.vn",
    "description": "Hệ thống chuyên ngành: CƠ SỞ DỮ LIỆU NUÔI TRỒNG THỦY SẢN",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/logo.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 29,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000001e",
    "name": "CƠ SỞ DỮ LIỆU GIỐNG THỦY SẢN, THỨC ĂN THỦY SẢN, SẢN PHẨM XỬ LÝ MÔI TRƯỜNG NUÔI TRỒNG THỦY SẢN",
    "url": "https://csdl.tongcucthuysan.gov.vn",
    "description": "Hệ thống chuyên ngành: CƠ SỞ DỮ LIỆU GIỐNG THỦY SẢN, THỨC ĂN THỦY SẢN, SẢN PHẨM XỬ LÝ MÔI TRƯỜNG NUÔI TRỒNG THỦY SẢN",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/logo.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 30,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000001f",
    "name": "KÊNH THÔNG TIN THỦY SẢN",
    "url": "http://csdlquantrac.tongcucthuysan.gov.vn:85",
    "description": "Hệ thống chuyên ngành: KÊNH THÔNG TIN THỦY SẢN",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/hate.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 31,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000020",
    "name": "CSDL QUẢN LÝ MÃ SỐ VÙNG TRỒNG XUẤT KHẨU",
    "url": "https://msvt-csdg.ppd.gov.vn/",
    "description": "Hệ thống chuyên ngành: CSDL QUẢN LÝ MÃ SỐ VÙNG TRỒNG XUẤT KHẨU",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/csdlvung.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 32,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000021",
    "name": "CSDL VỀ BỐ TRÍ DÂN CƯ NÔNG THÔN, HỢP TÁC XÃ, TRANG TRẠI, CƠ GIỚI HOÁ, LIÊN KẾT SẢN XUẤT, NGÀNH NGHỀ LÀNG NGHỀ, ĐÀO TẠO NGHỀ, OCOP",
    "url": "http://gsdgdcrd.vn/cms.nc",
    "description": "Hệ thống chuyên ngành: CSDL VỀ BỐ TRÍ DÂN CƯ NÔNG THÔN, HỢP TÁC XÃ, TRANG TRẠI, CƠ GIỚI HOÁ, LIÊN KẾT SẢN XUẤT, NGÀNH NGHỀ LÀNG NGHỀ, ĐÀO TẠO NGHỀ, OCOP",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/csdldancu.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 33,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000022",
    "name": "QUẢN LÝ THU, CHI QUỸ PHÒNG CHỐNG THIÊN TAI CỦA TỈNH",
    "url": "http://quypctttiengiang.netplus.vn/",
    "description": "Hệ thống chuyên ngành: QUẢN LÝ THU, CHI QUỸ PHÒNG CHỐNG THIÊN TAI CỦA TỈNH",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/tiengiang.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 34,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000023",
    "name": "THỐNG KÊ THIỆT HẠI PHỤC VỤ QUẢN LÝ, BÁO CÁO VÀ RA QUYẾT ĐỊNH",
    "url": "https://sotandantiengiang.vn/",
    "description": "Hệ thống chuyên ngành: THỐNG KÊ THIỆT HẠI PHỤC VỤ QUẢN LÝ, BÁO CÁO VÀ RA QUYẾT ĐỊNH",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/quantrac.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 35,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000024",
    "name": "HỆ THỐNG QUẢN LÝ THÔNG TIN DỊCH BỆNH ĐỘNG VẬT VIỆT NAM (VAHIS)",
    "url": "https://vahis.vn/home/login.aspx",
    "description": "Hệ thống chuyên ngành: HỆ THỐNG QUẢN LÝ THÔNG TIN DỊCH BỆNH ĐỘNG VẬT VIỆT NAM (VAHIS)",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/quantrac.jpg",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 36,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000025",
    "name": "CƠ SỞ DỮ LIỆU QUỐC GIA VỀ CHĂN NUÔI VÀ THÚ Y",
    "url": "http://csdlchannuoi.mae.gov.vn",
    "description": "Hệ thống chuyên ngành: CƠ SỞ DỮ LIỆU QUỐC GIA VỀ CHĂN NUÔI VÀ THÚ Y",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/channuoi.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 37,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000026",
    "name": "CƠ SỞ DỮ LIỆU THEO DÕI DIỄN BIẾN RỪNG",
    "url": "https://frms.vnforest.gov.vn",
    "description": "Hệ thống chuyên ngành: CƠ SỞ DỮ LIỆU THEO DÕI DIỄN BIẾN RỪNG",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/vnforest.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 38,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000027",
    "name": "HỆ THỐNG CHIA SẺ THÔNG TIN NGÀNH LÂM NGHIỆP FORESTRY 4.0",
    "url": "https://tnr.vnforest.gov.vn",
    "description": "Hệ thống chuyên ngành: HỆ THỐNG CHIA SẺ THÔNG TIN NGÀNH LÂM NGHIỆP FORESTRY 4.0",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/vnforest.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 39,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000028",
    "name": "HỆ THỐNG TRUY XUẤT NGUỒN GỐC NÔNG SẢN",
    "url": "https://txng.mae.gov.vn",
    "description": "Hệ thống chuyên ngành: HỆ THỐNG TRUY XUẤT NGUỒN GỐC NÔNG SẢN",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/logo.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 40,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-000000000029",
    "name": "HỆ THỐNG TRUY XUẤT NGUỒN GỐC HÀNG HÓA VERIGOODS",
    "url": "https://www.verigoods.vn/",
    "description": "Hệ thống chuyên ngành: HỆ THỐNG TRUY XUẤT NGUỒN GỐC HÀNG HÓA VERIGOODS",
    "favicon_url": "https://gate.ttcntnmt.com.vn/gate.ttcntt/img/logo.png",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 41,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000002a",
    "name": "Bản đồ tỉnh Đồng Tháp",
    "url": "https://geo226.ttcntnmt.com.vn/searchbando",
    "description": "Hệ thống chuyên ngành: Bản đồ tỉnh Đồng Tháp",
    "favicon_url": "https://www.google.com/s2/favicons?domain=geo226.ttcntnmt.com.vn&sz=128",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": false,
    "sort_order": 42,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000002b",
    "name": "CỔNG DỊCH VỤ CÔNG QUỐC GIA",
    "url": "https://dichvucong.gov.vn",
    "description": "Cổng dịch vụ công quốc gia của Chính phủ Việt Nam",
    "favicon_url": "https://dichvucong.gov.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 43,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  },
  {
    "id": "33333333-0003-0000-0000-00000000002c",
    "name": "CỔNG THÔNG TIN ĐIỆN TỬ CHÍNH PHỦ",
    "url": "https://chinhphu.vn",
    "description": "Cổng thông tin điện tử Chính phủ nước CHXHCN Việt Nam",
    "favicon_url": "https://chinhphu.vn/favicon.ico",
    "category_id": "11111111-1111-1111-1111-111111111103",
    "user_id": null,
    "is_global": true,
    "is_featured": true,
    "sort_order": 44,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "category": {
      "id": "11111111-1111-1111-1111-111111111103",
      "name": "Chính quyền",
      "description": "Hệ thống kết nối các ứng dụng chuyên ngành và cơ quan chính quyền",
      "icon": "Building2",
      "is_global": true,
      "user_id": null,
      "sort_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "website_count": 44
    }
  }
];

// In-memory cache for fast repeated reads across the server container
const CACHE_TTL_MS = 60 * 1000; // 60 seconds
let cachedCategories: { data: Category[]; timestamp: number } | null = null;
let cachedGlobalWebsites: { data: Website[]; timestamp: number } | null = null;

export function invalidateCategoriesCache() {
  cachedCategories = null;
}

export function invalidateWebsitesCache() {
  cachedGlobalWebsites = null;
  cachedCategories = null;
}

export const getCurrentUser = cache(async () => {
  if (!isSupabaseConfigured()) return null;

  try {
    const cookieStore = await cookies();
    const hasAuth = cookieStore
      .getAll()
      .some((c) => c.name.startsWith("sb-") && c.value && c.value.length > 0);
    if (!hasAuth) {
      return null;
    }
  } catch {
    // If called outside request context
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getUserProfile = cache(async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile) return profile;

  return {
    id: user.id,
    full_name:
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Người dùng",
    avatar_url: user.user_metadata?.avatar_url || null,
    role: "user",
    created_at: user.created_at,
    updated_at: user.created_at,
  };
});

export const getUserSettings = cache(async (): Promise<UserSettings | null> => {
  if (!isSupabaseConfigured()) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return settings || null;
});

interface RawCategoryRow extends Category {
  websites?: { count: number }[];
}

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!isSupabaseConfigured()) return DEFAULT_CATEGORIES;

  if (cachedCategories && Date.now() - cachedCategories.timestamp < CACHE_TTL_MS) {
    return cachedCategories.data;
  }

  const supabase = await createClient();

  const query = supabase
    .from("categories")
    .select("*, websites(count)")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  const { data, error } = await query;
  if (error || !data || data.length === 0) return DEFAULT_CATEGORIES;

  const rows = data as unknown as RawCategoryRow[];
  const hasNewCategories = rows.some(
    (c) => c.name === "AI" || c.name === "Đảng" || c.name === "Chính quyền"
  );
  if (!hasNewCategories) {
    return DEFAULT_CATEGORIES;
  }

  const result = rows.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    icon: cat.icon,
    is_global: cat.is_global,
    user_id: cat.user_id,
    sort_order: cat.sort_order,
    created_at: cat.created_at,
    updated_at: cat.updated_at,
    website_count: cat.websites?.[0]?.count || 0,
  }));

  cachedCategories = {
    data: result,
    timestamp: Date.now(),
  };

  return result;
});

export interface WebsiteFilters {
  categoryId?: string;
  scope?: "all" | "global" | "personal" | "favorites";
  query?: string;
  sortBy?: "name-asc" | "name-desc" | "created-desc" | "created-asc" | "sort-order";
  limit?: number;
}

export const getWebsites = cache(
  async (filters: WebsiteFilters = {}): Promise<Website[]> => {
    if (!isSupabaseConfigured()) return DEFAULT_WEBSITES;
    const supabase = await createClient();
    const user = await getCurrentUser();

    // 1. Fast path for favorites scope
    if (filters.scope === "favorites") {
      if (!user) return [];
      const { data: favs } = await supabase
        .from("user_favorites")
        .select("website_id")
        .eq("user_id", user.id);
      if (!favs || favs.length === 0) return [];

      const favIds = favs.map((f) => f.website_id);
      const { data: favWebsites } = await supabase
        .from("websites")
        .select("*, category:categories(*)")
        .in("id", favIds)
        .order("sort_order", { ascending: true });

      return (favWebsites || []).map((item) => ({
        ...item,
        is_favorite: true,
      }));
    }

    // 2. Fast path for personal scope
    if (filters.scope === "personal") {
      if (!user) return [];
      const { data: personal } = await supabase
        .from("websites")
        .select("*, category:categories(*)")
        .eq("user_id", user.id)
        .eq("is_global", false)
        .order("created_at", { ascending: false });

      return (personal || []).map((item) => ({
        ...item,
        is_favorite: false,
      }));
    }

    // 3. General query (all or global)
    const isDefaultQuery =
      !filters.categoryId &&
      !filters.query &&
      (!filters.sortBy || filters.sortBy === "sort-order") &&
      (!filters.limit || filters.limit >= 60);

    // Start fetching user favorites in parallel with websites query
    const favPromise = user
      ? supabase
          .from("user_favorites")
          .select("website_id")
          .eq("user_id", user.id)
      : Promise.resolve({ data: [] });

    let rows: Website[];
    if (
      isDefaultQuery &&
      cachedGlobalWebsites &&
      Date.now() - cachedGlobalWebsites.timestamp < CACHE_TTL_MS
    ) {
      rows = cachedGlobalWebsites.data;
    } else {
      let query = supabase
        .from("websites")
        .select("*, category:categories(*)");

      if (filters.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }
      if (filters.scope === "global") {
        query = query.eq("is_global", true);
      }
      if (filters.query && filters.query.trim().length > 0) {
        const q = `%${filters.query.trim()}%`;
        query = query.or(`name.ilike.${q},url.ilike.${q},description.ilike.${q}`);
      }

      switch (filters.sortBy) {
        case "name-asc":
          query = query.order("name", { ascending: true });
          break;
        case "name-desc":
          query = query.order("name", { ascending: false });
          break;
        case "created-asc":
          query = query.order("created_at", { ascending: true });
          break;
        case "created-desc":
          query = query.order("created_at", { ascending: false });
          break;
        case "sort-order":
        default:
          query = query
            .order("sort_order", { ascending: true })
            .order("is_featured", { ascending: false })
            .order("name", { ascending: true });
          break;
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const [{ data }, favRes] = await Promise.all([query, favPromise]);
      rows = (data || []) as unknown as Website[];

      const hasGateCards = rows.some(
        (w) =>
          w.url.includes("ttcntnmt.com.vn") ||
          w.name.includes("ILIS") ||
          w.name.includes("SỞ NÔNG NGHIỆP")
      );

      if (!hasGateCards) {
        const personalWebsites = rows.filter((r) => !r.is_global);
        rows = [...DEFAULT_WEBSITES, ...personalWebsites];
      }

      if (isDefaultQuery && rows.length > 0) {
        cachedGlobalWebsites = {
          data: rows,
          timestamp: Date.now(),
        };
      }

      const favoriteIds = new Set<string>();
      if (favRes && favRes.data) {
        favRes.data.forEach((f: { website_id: string }) => favoriteIds.add(f.website_id));
      }

      return rows.map((item) => ({
        ...item,
        is_favorite: favoriteIds.has(item.id) || favoriteIds.has(getDeterministicWebsiteUuid(item.id)),
      }));
    }

    const favRes = await favPromise;
    const favoriteIds = new Set<string>();
    if (favRes && favRes.data) {
      favRes.data.forEach((f: { website_id: string }) => favoriteIds.add(f.website_id));
    }

    return rows.map((item) => ({
      ...item,
      is_favorite: favoriteIds.has(item.id) || favoriteIds.has(getDeterministicWebsiteUuid(item.id)),
    }));
  }
);

interface RawVisitRow {
  id: string;
  visited_at: string;
  website: Website | Website[] | null;
}

export interface RecentVisitItem {
  id: string;
  visited_at: string;
  website: Website;
}

export const getRecentVisits = cache(async (limit: number = 10): Promise<RecentVisitItem[]> => {
  if (!isSupabaseConfigured()) return [];
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_visits")
    .select("id, visited_at, website:websites(*, category:categories(*))")
    .eq("user_id", user.id)
    .order("visited_at", { ascending: false })
    .limit(limit * 3);

  if (error || !data) return [];

  const rows = data as unknown as RawVisitRow[];
  const seen = new Set<string>();
  const results: RecentVisitItem[] = [];

  for (const item of rows) {
    const w = Array.isArray(item.website) ? item.website[0] : item.website;
    if (w && !seen.has(w.id)) {
      seen.add(w.id);
      results.push({
        id: item.id,
        visited_at: item.visited_at,
        website: w,
      });
      if (results.length >= limit) break;
    }
  }

  return results;
});

export const getUserNotes = cache(async (): Promise<UserNote[]> => {
  if (!isSupabaseConfigured()) return [];
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_notes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data;
});

export const getDashboardStats = cache(async (): Promise<DashboardStats> => {
  if (!isSupabaseConfigured()) {
    return {
      totalWebsites: DEFAULT_WEBSITES.length,
      favoriteWebsites: 0,
      totalCategories: DEFAULT_CATEGORIES.length,
      personalWebsites: 0,
      globalWebsites: DEFAULT_WEBSITES.length,
      recentVisitsCount: 0,
    };
  }

  const user = await getCurrentUser();
  const supabase = await createClient();

  // Execute all 6 stats queries in parallel
  const [
    totalWebsitesRes,
    favRes,
    totalCategoriesRes,
    personalRes,
    globalRes,
    recentVisitsRes,
  ] = await Promise.all([
    supabase.from("websites").select("*", { count: "exact", head: true }),
    user
      ? supabase.from("user_favorites").select("*", { count: "exact", head: true }).eq("user_id", user.id)
      : Promise.resolve({ count: 0 }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    user
      ? supabase.from("websites").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("is_global", false)
      : Promise.resolve({ count: 0 }),
    supabase.from("websites").select("*", { count: "exact", head: true }).eq("is_global", true),
    user
      ? supabase.from("user_visits").select("*", { count: "exact", head: true }).eq("user_id", user.id)
      : Promise.resolve({ count: 0 }),
  ]);

  return {
    totalWebsites: totalWebsitesRes.count || 0,
    favoriteWebsites: favRes.count || 0,
    totalCategories: totalCategoriesRes.count || 0,
    personalWebsites: personalRes.count || 0,
    globalWebsites: globalRes.count || 0,
    recentVisitsCount: recentVisitsRes.count || 0,
  };
});

export const getAdminStats = cache(async (): Promise<AdminStats> => {
  if (!isSupabaseConfigured()) {
    return {
      totalUsers: 0,
      totalWebsites: DEFAULT_WEBSITES.length,
      globalWebsites: DEFAULT_WEBSITES.length,
      personalWebsites: 0,
      totalCategories: DEFAULT_CATEGORIES.length,
    };
  }

  const supabase = await createClient();

  const [
    { count: users },
    { count: totalWebsites },
    { count: globalWebsites },
    { count: personalWebsites },
    { count: categories },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("websites").select("*", { count: "exact", head: true }),
    supabase.from("websites").select("*", { count: "exact", head: true }).eq("is_global", true),
    supabase.from("websites").select("*", { count: "exact", head: true }).eq("is_global", false),
    supabase.from("categories").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalUsers: users || 0,
    totalWebsites: totalWebsites || 0,
    globalWebsites: globalWebsites || 0,
    personalWebsites: personalWebsites || 0,
    totalCategories: categories || 0,
  };
});

export const getAdminUsers = cache(async (): Promise<Profile[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
});


export { getEventLogs, getEventLogStats } from "./logger";
