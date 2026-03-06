'use client';
import { useState } from 'react';
import styles from './FAQ.module.css';

const faqs = [
    {
        q: 'ElevateCV phân tích CV như thế nào?',
        a: 'ElevateCV sử dụng AI tiên tiến (Google Gemini) để phân tích CV của bạn trên nhiều tiêu chí: bố cục, nội dung, từ khóa, kinh nghiệm, kỹ năng, và mức độ phù hợp với mô tả công việc. Kết quả được trả về dưới dạng điểm số chi tiết kèm gợi ý cải thiện cụ thể.',
    },
    {
        q: 'Dữ liệu CV của tôi có được bảo mật không?',
        a: 'Hoàn toàn bảo mật. CV của bạn chỉ được sử dụng để phân tích trong phiên làm việc hiện tại và sẽ không được lưu trữ hay chia sẻ với bất kỳ bên thứ ba nào. Chúng tôi cam kết bảo vệ quyền riêng tư của bạn.',
    },
    {
        q: 'Tôi có thể sử dụng miễn phí không?',
        a: 'Có! Bạn có thể sử dụng ElevateCV hoàn toàn miễn phí với số lượt phân tích giới hạn mỗi ngày. Phiên bản miễn phí cung cấp đầy đủ các tính năng phân tích cơ bản.',
    },
    {
        q: 'ElevateCV hỗ trợ những định dạng file nào?',
        a: 'Hiện tại ElevateCV hỗ trợ các định dạng phổ biến nhất bao gồm PDF và DOCX. Kích thước file tối đa là 2MB. Chúng tôi đang phát triển thêm hỗ trợ cho nhiều định dạng khác.',
    },
    {
        q: 'Làm sao để cải thiện điểm số CV?',
        a: 'Sau khi nhận kết quả phân tích, hãy tập trung vào các mục có điểm thấp nhất. Sử dụng gợi ý từ "Xưởng Tối Ưu Hóa" để cải thiện từng phần. Bạn có thể upload lại CV sau khi chỉnh sửa để theo dõi tiến trình.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className={styles.faq} id="faq">
            <h2 className={styles.sectionTitle}>Câu Hỏi Thường Gặp</h2>
            <p className={styles.sectionSubtitle}>
                Mọi thắc mắc cần biết về dịch vụ của chúng tôi
            </p>
            <div className={styles.faqList}>
                {faqs.map((faq, i) => (
                    <div
                        key={i}
                        className={`${styles.faqItem} ${openIndex === i ? styles.faqItemOpen : ''}`}
                    >
                        <button
                            className={styles.faqQuestion}
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            aria-expanded={openIndex === i}
                        >
                            {faq.q}
                            <span className={`${styles.faqIcon} ${openIndex === i ? styles.faqIconOpen : ''}`}>
                                +
                            </span>
                        </button>
                        {openIndex === i && (
                            <div className={styles.faqAnswer}>{faq.a}</div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
