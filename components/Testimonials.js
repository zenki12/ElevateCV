'use client';
import { useState } from 'react';
import styles from './Testimonials.module.css';

const testimonials = [
    {
        quote: 'ElevateCV đã giúp tôi nhận ra những điểm yếu trong CV mà tôi không hề biết. Sau khi cải thiện, tôi đã nhận được lời mời phỏng vấn ngay tuần sau!',
        name: 'Minh Tuấn',
        role: 'Software Engineer',
        initials: 'MT',
    },
    {
        quote: 'Tính năng so sánh CV với mô tả công việc thật sự hữu ích. Tôi có thể tùy chỉnh CV cho từng vị trí ứng tuyển một cách dễ dàng.',
        name: 'Anh Nguyên',
        role: 'Product Manager',
        initials: 'AN',
    },
    {
        quote: 'Công cụ phân tích bố cục CV giúp tôi trình bày chuyên nghiệp hơn. Điểm số chi tiết giúp tôi biết chính xác cần cải thiện ở đâu.',
        name: 'Thanh Hà',
        role: 'Marketing Specialist',
        initials: 'TH',
    },
    {
        quote: 'Tôi đã thử nhiều công cụ review CV nhưng ElevateCV cho kết quả chi tiết và thực tế nhất. Rất đáng để sử dụng!',
        name: 'Đức Anh',
        role: 'Data Analyst',
        initials: 'ĐA',
    },
    {
        quote: 'Xưởng tối ưu hóa CV cho tôi lộ trình cụ thể để nâng cấp từng phần. Tôi đã tăng được 20 điểm chỉ sau 2 lần chỉnh sửa.',
        name: 'Thu Trang',
        role: 'UX Designer',
        initials: 'TT',
    },
    {
        quote: 'Phân tích kinh nghiệm làm việc rất sâu và chi tiết. AI gợi ý cách viết lại mô tả công việc một cách ấn tượng hơn nhiều.',
        name: 'Hoàng Long',
        role: 'Business Development',
        initials: 'HL',
    },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const maxIndex = Math.max(0, testimonials.length - 3);

    return (
        <section className={styles.testimonials}>
            <h2 className={styles.sectionTitle}>Người Dùng Nói Gì</h2>
            <p className={styles.sectionSubtitle}>
                Cùng khám phá trải nghiệm người dùng ElevateCV để cùng tạo sự khác biệt
            </p>
            <div className={styles.carousel}>
                <div
                    className={styles.carouselTrack}
                    style={{
                        transform: `translateX(-${currentIndex * (100 / 3 + 2)}%)`,
                        transition: 'transform 0.5s ease',
                    }}
                >
                    {testimonials.map((t, i) => (
                        <div key={i} className={styles.testimonialCard}>
                            <div className={styles.quoteIcon}>&ldquo;</div>
                            <p className={styles.quoteText}>{t.quote}</p>
                            <div className={styles.divider} />
                            <div className={styles.author}>
                                <div className={styles.authorAvatar}>{t.initials}</div>
                                <div className={styles.authorInfo}>
                                    <div className={styles.authorName}>{t.name}</div>
                                    <div className={styles.authorRole}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.dots}>
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
                            onClick={() => setCurrentIndex(i)}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
