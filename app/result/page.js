'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './result.module.css';

function getScoreClass(score) {
    if (score >= 75) return styles.scoreHigh;
    if (score >= 50) return styles.scoreMid;
    return styles.scoreLow;
}

function getScoreColor(score) {
    if (score >= 75) return 'var(--color-success)';
    if (score >= 50) return 'var(--color-warning)';
    return 'var(--color-danger)';
}

function getBadgeClass(rec) {
    if (rec === 'NÊN ỨNG TUYỂN') return styles.badgeApply;
    if (rec === 'KHÔNG NÊN') return styles.badgeDont;
    return styles.badgeConsider;
}

function ScoreCircle({ score }) {
    const radius = 75;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className={styles.scoreCircle}>
            <svg className={styles.scoreCircleSvg} viewBox="0 0 180 180">
                <circle className={styles.scoreCircleBg} cx="90" cy="90" r={radius} />
                <circle
                    className={styles.scoreCircleProgress}
                    cx="90"
                    cy="90"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className={styles.scoreValue}>
                <div className={styles.scoreNumber}>{score}</div>
                <div className={styles.scoreLabel}>Tổng điểm xuất</div>
            </div>
        </div>
    );
}

export default function ResultPage() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = sessionStorage.getItem('analysisResult');
        if (stored) {
            setData(JSON.parse(stored));
            setLoading(false);
        } else {
            router.push('/review');
        }
    }, [router]);

    if (loading || !data) {
        return (
            <div className={styles.resultPage}>
                <Navbar />
                <div className={styles.resultContent}>
                    <div className={styles.loadingScreen}>
                        <div className={styles.loadingSpinner} />
                        <div className={styles.loadingText}>Đang tải kết quả...</div>
                    </div>
                </div>
            </div>
        );
    }

    const initials = data.candidateName
        ? data.candidateName.split(' ').slice(-2).map(w => w[0]).join('')
        : 'CV';

    return (
        <div className={styles.resultPage}>
            <Navbar />

            <div className={styles.resultContent}>
                {/* Back Button */}
                <Link href="/review" className={styles.backBtn}>
                    ← Phân tích CV khác
                </Link>

                {/* Header */}
                <div className={styles.resultHeader}>
                    <div className={styles.candidateAvatar}>{initials}</div>
                    <div className={styles.candidateInfo}>
                        <h1>CV Insight Pro</h1>
                        <p>Phân tích CV cho: {data.candidateName}</p>
                    </div>
                </div>

                {/* Recommendation Banner */}
                <div className={styles.recommendationBanner}>
                    <div>
                        <div className={styles.recommendationTitle}>
                            🎯 Khuyến Nghị Ứng Tuyển
                        </div>
                        <p className={styles.recommendationDetail}>
                            {data.recommendationDetail}
                        </p>
                    </div>
                    <div className={`${styles.recommendationBadge} ${getBadgeClass(data.recommendation)}`}>
                        {data.recommendation}
                    </div>
                </div>

                {/* Strategy Section */}
                <div className={styles.strategySection}>
                    <div className={styles.strategyTitle}>
                        💡 Chiến lược tối ưu CV
                    </div>
                    <div className={styles.strategyInner}>
                        <div>
                            <div className={styles.strategySummary}>
                                {data.cvStrategy?.summary}
                            </div>
                            <div className={styles.strategyCards}>
                                <div className={styles.strategyCard}>
                                    <div className={styles.strategyCardTitle}>
                                        ✅ Tiếp cận
                                    </div>
                                    <p className={styles.strategyCardText}>
                                        {data.cvStrategy?.shouldDo}
                                    </p>
                                </div>
                                <div className={styles.strategyCard}>
                                    <div className={styles.strategyCardTitle}>
                                        ☐ Không nên
                                    </div>
                                    <p className={styles.strategyCardText}>
                                        {data.cvStrategy?.shouldNotDo}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.scoreCircleWrapper}>
                            <ScoreCircle score={data.overallScore} />
                        </div>
                    </div>
                </div>

                {/* Two Columns: Metrics + Criteria */}
                <div className={styles.twoColumns}>
                    {/* Metrics Map */}
                    <div className={styles.metricsSection}>
                        <div className={styles.sectionTitle}>📊 Bản đồ 10 chỉ số CV</div>
                        <div className={styles.metricsGrid}>
                            {data.metrics?.map((m, i) => (
                                <div key={i} className={styles.metricCard}>
                                    <div className={styles.metricHeader}>
                                        <span className={styles.metricName}>{m.name}</span>
                                        <span className={`${styles.metricScore} ${getScoreClass(m.score)}`}>
                                            {m.score}
                                        </span>
                                    </div>
                                    <div className={styles.metricComment}>{m.comment}</div>
                                    <div className={styles.metricBar}>
                                        <div
                                            className={styles.metricBarFill}
                                            style={{
                                                width: `${m.score}%`,
                                                background: getScoreColor(m.score),
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Criteria Detail */}
                    <div className={styles.criteriaSection}>
                        <div className={styles.sectionTitle}>📋 Chi tiết tiêu chí đánh giá</div>
                        <div className={styles.criteriaList}>
                            {data.metrics?.slice(0, 6).map((m, i) => (
                                <div key={i} className={styles.criteriaItem}>
                                    <div
                                        className={styles.criteriaScore}
                                        style={{
                                            background: m.score >= 75 ? 'var(--color-success-bg)' : m.score >= 50 ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
                                            color: m.score >= 75 ? 'var(--color-success)' : m.score >= 50 ? 'var(--color-warning)' : 'var(--color-danger)',
                                        }}
                                    >
                                        {m.score}
                                    </div>
                                    <div>
                                        <div className={styles.criteriaName}>{m.name}</div>
                                        <div className={styles.criteriaComment}>{m.comment}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Layout Section */}
                <div className={styles.layoutSection}>
                    <div className={styles.layoutHeader}>
                        <div className={styles.sectionTitle}>📐 Đánh giá Bố cục & Trình bày</div>
                        <div
                            className={styles.layoutScore}
                            style={{
                                background: data.layout?.score >= 75 ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                                color: data.layout?.score >= 75 ? 'var(--color-success)' : 'var(--color-warning)',
                            }}
                        >
                            Layout Score: {data.layout?.score}/100
                        </div>
                    </div>
                    <div className={styles.layoutContent}>
                        <div className={styles.layoutSummary}>
                            {data.layout?.summary}
                        </div>
                        <div className={styles.layoutTips}>
                            <div className={styles.layoutTipsTitle}>Tips tối ưu bố cục</div>
                            {data.layout?.tips?.map((tip, i) => (
                                <div key={i} className={styles.layoutTip}>
                                    <span className={styles.tipIcon}>✅</span>
                                    <span>{tip}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Optimization Lab */}
                <div className={styles.optimizationSection}>
                    <div className={styles.sectionTitle}>
                        🔧 Xưởng Tối Ưu Hóa (Optimization Lab)
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                        Lộ trình nâng cấp chi tiết trên từng tiêu chí nội dung.
                    </p>
                    <div className={styles.optimizationList}>
                        {data.optimizations?.map((opt, i) => (
                            <div key={i} className={styles.optimizationItem}>
                                <div className={styles.optimizationHeader}>
                                    {opt.section}
                                </div>
                                <div className={styles.optimizationBody}>
                                    <div className={styles.optimizationCurrent}>
                                        <div className={`${styles.optimizationLabel} ${styles.labelCurrent}`}>
                                            Hiện tại
                                        </div>
                                        <div className={styles.optimizationText}>{opt.current}</div>
                                    </div>
                                    <div className={styles.optimizationImproved}>
                                        <div className={`${styles.optimizationLabel} ${styles.labelImproved}`}>
                                            Gợi ý cải thiện
                                        </div>
                                        <div className={styles.optimizationText}>{opt.improved}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Experience Section */}
                <div className={styles.experienceSection}>
                    <div className={styles.sectionTitle}>
                        💼 Kinh Nghiệm Làm Việc
                    </div>
                    <div className={styles.experienceList}>
                        {data.experiences?.map((exp, i) => (
                            <div key={i} className={styles.experienceItem}>
                                <div className={styles.experienceHeader}>
                                    <div className={styles.experienceTitle}>
                                        🟡 {exp.title}
                                    </div>
                                    <div
                                        className={styles.experienceScore}
                                        style={{
                                            background: exp.score >= 75 ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                                            color: exp.score >= 75 ? 'var(--color-success)' : 'var(--color-warning)',
                                        }}
                                    >
                                        {exp.score}/100
                                    </div>
                                </div>
                                <div className={styles.experienceFeedback}>
                                    <strong>📝 Phản hồi:</strong> {exp.feedback}
                                </div>
                                <div className={styles.experienceSuggestion}>
                                    <strong>💡 Gợi ý viết lại:</strong> {exp.suggestion}
                                </div>
                                {exp.keywords?.length > 0 && (
                                    <div className={styles.keywords}>
                                        {exp.keywords.map((kw, j) => (
                                            <span key={j} className={styles.keyword}>{kw}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
