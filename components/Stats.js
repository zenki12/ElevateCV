'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Stats.module.css';

function AnimatedCounter({ target, duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const increment = target / (duration / 16);
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= target) {
                            setCount(target);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                    return () => clearInterval(timer);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration, hasAnimated]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function Stats() {
    return (
        <section className={styles.stats}>
            <div className={styles.statsInner}>
                <div className={styles.marquee}>
                    <div className={styles.marqueeLabel}>🔥 Xu hướng tuyển dụng hôm nay</div>
                    <div className={styles.marqueeText}>Thấy ngay tác động khi cải thiện CV của bạn</div>
                </div>
                <div className={styles.statCards}>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>
                            <AnimatedCounter target={1253} />
                        </div>
                        <div className={styles.statLabel}>CV đã phân tích</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>
                            <AnimatedCounter target={897} />
                        </div>
                        <div className={styles.statLabel}>Người dùng tin tưởng</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
