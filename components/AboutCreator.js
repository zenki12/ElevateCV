'use client';
import styles from './AboutCreator.module.css';

export default function AboutCreator() {
    return (
        <section className={styles.aboutCreator}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.avatarSection}>
                        {/* We will use a placeholder or generic avatar since we don't have his real photo */}
                        <div className={styles.avatar}>
                            <span>XT</span>
                        </div>
                        <div className={styles.decorativeCircle}></div>
                    </div>
                    <div className={styles.contentSection}>
                        <h2 className={styles.greeting}>Xin chào, tôi là <span>Xuân Thái</span> 👋</h2>
                        <h3 className={styles.role}>Người sáng lập & Phát triển ElevateCV</h3>
                        <p className={styles.story}>
                            Là một người từng chật vật với hàng chục phiên bản CV khác nhau để tìm kiếm cơ hội nghề nghiệp, tôi hiểu rất rõ những khó khăn của các ứng viên khi ứng tuyển.
                        </p>
                        <p className={styles.story}>
                            <strong>ElevateCV</strong> được tạo ra từ chính trải nghiệm đó — với mong muốn ứng dụng sức mạnh của AI để giúp bất kỳ ai cũng có thể dễ dàng sở hữu một bản CV chuẩn mực, nổi bật và tự tin nắm bắt công việc mơ ước.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="https://www.facebook.com/okthaiday/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                📘 Kết nối Facebook
                            </a>
                            <a href="https://zalo.me/0969504696" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                💬 Nhắn tin Zalo
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
