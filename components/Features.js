import styles from './Features.module.css';

export default function Features() {
    return (
        <section className={styles.features} id="features">
            <h2 className={styles.sectionTitle}>Chúng Tôi Giúp Gì Cho Bạn</h2>
            <p className={styles.sectionSubtitle}>
                Công cụ phân tích CV thông minh, giúp bạn tự tin hơn trong hành trình tìm việc
            </p>
            <div className={styles.featureGrid}>
                <div className={styles.featureCard}>
                    <div className={`${styles.featureIcon} ${styles.featureIconAI}`}>📄</div>
                    <h3 className={styles.featureTitle}>Phân Hóa CV Bằng AI</h3>
                    <p className={styles.featureDesc}>
                        Công nghệ phân tích CV sử dụng AI tiên tiến để đánh giá chi tiết từng phần
                        của CV bạn. Từ bố cục, nội dung đến cách trình bày — tất cả được phân tích
                        sâu để giúp bạn cải thiện.
                    </p>
                </div>
                <div className={styles.featureCard}>
                    <div className={`${styles.featureIcon} ${styles.featureIconMatch}`}>🎯</div>
                    <h3 className={styles.featureTitle}>Điểm Phù Hợp Công Việc</h3>
                    <p className={styles.featureDesc}>
                        Tải lên mô tả công việc (JD) và chúng tôi sẽ so sánh CV của bạn với yêu cầu
                        tuyển dụng. Nhận điểm phù hợp chi tiết và gợi ý cải thiện để tăng cơ hội
                        trúng tuyển.
                    </p>
                </div>
            </div>
        </section>
    );
}
