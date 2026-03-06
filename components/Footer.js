import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.footerTop}>
                    <div className={styles.footerBrand}>
                        <div className={styles.footerLogo}>
                            <span className={styles.footerLogoIcon}>E</span>
                            ElevateCV
                        </div>
                        <p className={styles.footerDesc}>
                            Công cụ phân tích CV bằng AI, giúp bạn tự tin hơn trong hành trình tìm kiếm công việc mơ ước.
                        </p>
                    </div>

                    <div className={styles.footerLinks}>
                        <div className={styles.footerLinksTitle}>Liên hệ</div>
                        <a href="https://facebook.com" className={styles.footerLink} target="_blank" rel="noopener noreferrer">
                            📘 Facebook
                        </a>
                        <a href="https://linkedin.com" className={styles.footerLink} target="_blank" rel="noopener noreferrer">
                            💼 LinkedIn
                        </a>
                        <a href="mailto:info@elevatecv.com" className={styles.footerLink}>
                            ✉️ info@elevatecv.com
                        </a>
                    </div>

                    <div className={styles.footerLinks}>
                        <div className={styles.footerLinksTitle}>Khám phá</div>
                        <Link href="/review" className={styles.footerLink}>
                            Phân tích CV
                        </Link>
                        <Link href="/#features" className={styles.footerLink}>
                            Tính năng
                        </Link>
                        <Link href="/#faq" className={styles.footerLink}>
                            Câu hỏi thường gặp
                        </Link>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <div className={styles.copyright}>
                        © 2026 ElevateCV. Tất cả quyền được bảo lưu.
                    </div>
                    <div className={styles.footerBottomLinks}>
                        <a href="#" className={styles.footerBottomLink}>Điều Khoản Dịch Vụ</a>
                        <a href="#" className={styles.footerBottomLink}>Bảo Mật</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
