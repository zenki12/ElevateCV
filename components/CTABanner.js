import Link from 'next/link';
import styles from './CTABanner.module.css';

export default function CTABanner() {
    return (
        <section className={styles.cta}>
            <div className={styles.ctaInner}>
                <div className={styles.ctaContent}>
                    <h2 className={styles.ctaTitle}>Sẵn Sàng Tìm Kiếm Việc Làm?</h2>
                    <p className={styles.ctaSubtitle}>
                        Để ElevateCV giúp bạn tự tin hơn, sáng tạo hơn và ghi điểm tuyệt đối
                        trong mắt nhà tuyển dụng với bản CV hoàn hảo.
                    </p>
                    <div className={styles.ctaButtons}>
                        <Link href="/review" className={styles.ctaBtnPrimary}>
                            Bắt đầu phân tích CV
                        </Link>
                        <Link href="/#features" className={styles.ctaBtnSecondary}>
                            Xem tính năng
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
