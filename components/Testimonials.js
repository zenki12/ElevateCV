'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './Testimonials.module.css';

const testimonials = [
    {
        quote: 'ElevateCV đã giúp tôi nhận ra những điểm yếu trong CV mà tôi không hề biết. Sau khi cải thiện theo chuẩn ATS, tôi đã nhận được lời mời phỏng vấn ngay tuần sau!',
        name: 'Minh Tuấn',
        role: 'Software Engineer',
        initials: 'MT',
    },
    {
        quote: 'Nhờ có Xưởng tối ưu hóa, tôi mới biết cách làm nổi bật kinh nghiệm làm việc của mình bằng số liệu. Rất dễ sử dụng và cực kỳ chi tiết.',
        name: 'Anh Nguyên',
        role: 'Marketing Associate',
        initials: 'AN',
    },
    {
        quote: 'Tôi thích tính năng chấm điểm so với JD. Nó chỉ ra chính xác những từ khóa cốt lõi mà nhà tuyển dụng đang tìm kiếm nhưng CV của tôi lại thiếu sót.',
        name: 'Hoàng Hà',
        role: 'Data Analyst',
        initials: 'HH',
    },
    {
        quote: 'Từ một CV khá lộn xộn, AI đã hướng dẫn tôi sắp xếp lại cấu trúc chuyên nghiệp hơn rất nhiều. Công cụ thực sự không thể thiếu cho sinh viên mới ra trường.',
        name: 'Đức Phát',
        role: 'Entry-level UX Designer',
        initials: 'ĐP',
    },
    {
        quote: 'Trước đây rải CV khắp nơi không ai gọi đi phỏng vấn. Dùng ElevateCV tối ưu xong, tỷ lệ phản hồi của nhà tuyển dụng tăng lên đáng kinh ngạc!',
        name: 'Thu Trang',
        role: 'HR Specialist',
        initials: 'TT',
    },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentTranslate, setCurrentTranslate] = useState(0);

    // We display 3 cards on desktop, 1 on mobile
    const [itemsPerView, setItemsPerView] = useState(3);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setItemsPerView(1);
            else if (window.innerWidth < 1024) setItemsPerView(2);
            else setItemsPerView(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, testimonials.length - itemsPerView);

    // Auto-play
    useEffect(() => {
        if (isDragging) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [isDragging, maxIndex]);

    // Drag handlers
    const handleDragStart = (e) => {
        setIsDragging(true);
        setStartX(e.type.includes('mouse') ? e.pageX : e.touches[0].clientX);
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diff = currentX - startX;
        setCurrentTranslate(diff);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        const threshold = 50; // pixels to trigger slide logic
        if (currentTranslate < -threshold && currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1);
        } else if (currentTranslate > threshold && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
        setCurrentTranslate(0);
    };

    // Prevent default drag behaviors on images/text
    const preventDrag = (e) => e.preventDefault();

    const slidePercentage = 100 / itemsPerView;
    const baseTranslate = -(currentIndex * slidePercentage);

    // Convert currentTranslate (px) to rough percentage based on container width for smooth live drag
    const containerWidth = containerRef.current?.offsetWidth || 1;
    const dragPercentage = (currentTranslate / containerWidth) * 100;

    const transformStyle = `translateX(calc(${baseTranslate}% + ${isDragging ? dragPercentage : 0}%))`;


    return (
        <section className={styles.testimonials}>
            <h2 className={styles.sectionTitle}>Người Dùng Nói Gì</h2>
            <p className={styles.sectionSubtitle}>
                Cùng khám phá trải nghiệm xuất sắc của mạng lưới người dùng ElevateCV
            </p>
            <div
                className={styles.carouselContainer}
                ref={containerRef}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
            >
                <div
                    className={styles.carouselTrack}
                    style={{
                        transform: transformStyle,
                        transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    {testimonials.map((t, i) => (
                        <div key={i} className={styles.testimonialCard} onDragStart={preventDrag}>
                            <div className={styles.testimonialCardInner}>
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
                        </div>
                    ))}
                </div>
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
        </section>
    );
}
