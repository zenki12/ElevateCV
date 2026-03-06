import "./globals.css";

export const metadata = {
  title: "ElevateCV - Review & Phân Tích CV Bằng AI",
  description: "Tải lên CV và mô tả công việc bạn muốn. Nhận tư vấn đơn giản để cải thiện CV và chia sẻ sự khác biệt.",
  keywords: "CV review, phân tích CV, AI, tìm việc, resume, career",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
