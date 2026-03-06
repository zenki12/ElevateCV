import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.heroContent}>
                <div className={styles.badge}>✦ Phân tích CV thông minh</div>
                <h1 className={styles.title}>
                    Review & Phân Tích CV{' '}
                    <span className={styles.titleHighlight}>Bằng AI</span>
                </h1>
                <p className={styles.subtitle}>
                    Tải lên CV và mô tả công việc bạn muốn. Nhận tư vấn đơn giản
                    để cải thiện CV và chia sẻ sự khác biệt của bạn.
                </p>
                <div className={styles.heroCtas}>
                    <Link href="/review" className="btn btn-primary btn-lg">
                        🚀 Phân tích CV miễn phí
                    </Link>
                    <Link href="/#features" className="btn btn-secondary btn-lg">
                        Tìm hiểu thêm
                    </Link>
                </div>
            </div>
        </section>
    );
}
