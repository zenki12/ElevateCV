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

function getBadgeClass(rec) {
    if (rec === 'NÊN ỨNG TUYỂN') return styles.badgeApply;
    if (rec === 'KHÔNG NÊN') return styles.badgeDont;
    return styles.badgeConsider;
}

function getStatusClass(color) {
    if (color === 'green') return styles.statusGreen;
    if (color === 'red') return styles.statusRed;
    return styles.statusYellow;
}

function getScoreColor(score) {
    if (score >= 75) return '#2E7D32';
    if (score >= 50) return '#F57F17';
    return '#C62828';
}

/* SVG Radar Chart */
function RadarChart({ metrics }) {
    const size = 450;
    const center = size / 2;
    const maxRadius = 110;
    const levels = 5;
    const total = metrics.length;
    const angleSlice = (Math.PI * 2) / total;

    // Build grid lines
    const gridLines = [];
    for (let lvl = 1; lvl <= levels; lvl++) {
        const r = (maxRadius / levels) * lvl;
        const points = [];
        for (let i = 0; i < total; i++) {
            const angle = angleSlice * i - Math.PI / 2;
            points.push(`${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`);
        }
        gridLines.push(points.join(' '));
    }

    // Build axis lines
    const axes = [];
    for (let i = 0; i < total; i++) {
        const angle = angleSlice * i - Math.PI / 2;
        axes.push({
            x: center + maxRadius * Math.cos(angle),
            y: center + maxRadius * Math.sin(angle),
            labelX: center + (maxRadius + 20) * Math.cos(angle),
            labelY: center + (maxRadius + 20) * Math.sin(angle),
        });
    }

    // Build data polygon
    const dataPoints = metrics.map((m, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const r = (m.score / 100) * maxRadius;
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    });

    return (
        <svg viewBox={`0 0 ${size} ${size}`} className={styles.radarChart}>
            {/* Grid */}
            {gridLines.map((pts, i) => (
                <polygon
                    key={i}
                    points={pts}
                    fill="none"
                    stroke="var(--color-border-light)"
                    strokeWidth="1"
                />
            ))}
            {/* Axes */}
            {axes.map((a, i) => (
                <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={a.x}
                    y2={a.y}
                    stroke="var(--color-border-light)"
                    strokeWidth="1"
                />
            ))}
            {/* Data */}
            <polygon
                points={dataPoints.join(' ')}
                fill="rgba(197, 113, 61, 0.2)"
                stroke="var(--color-primary)"
                strokeWidth="2"
            />
            {/* Data points */}
            {metrics.map((m, i) => {
                const angle = angleSlice * i - Math.PI / 2;
                const r = (m.score / 100) * maxRadius;
                return (
                    <circle
                        key={i}
                        cx={center + r * Math.cos(angle)}
                        cy={center + r * Math.sin(angle)}
                        r="4"
                        fill="var(--color-primary)"
                        stroke="white"
                        strokeWidth="2"
                    />
                );
            })}

            {/* Axis labels */}
            {axes.map((a, i) => {
                const angle = angleSlice * i - Math.PI / 2;
                // Adjust text alignment based on angle
                let textAnchor = 'middle';
                if (Math.abs(Math.cos(angle)) > 0.1) {
                    textAnchor = Math.cos(angle) > 0 ? 'start' : 'end';
                }

                return (
                    <text
                        key={`label-${i}`}
                        x={a.labelX}
                        y={a.labelY}
                        fontSize="10"
                        fontWeight="600"
                        fill="var(--color-text-secondary)"
                        textAnchor={textAnchor}
                        dominantBaseline="middle"
                    >
                        {metrics[i].name}
                    </text>
                );
            })}
        </svg>
    );
}

/* Score Circle */
function ScoreCircle({ score }) {
    const radius = 75;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className={styles.scoreCircle}>
            <svg className={styles.scoreCircleSvg} viewBox="0 0 180 180">
                <circle className={styles.scoreCircleBg} cx="90" cy="90" r={radius} />
                <circle className={styles.scoreCircleProgress} cx="90" cy="90" r={radius} strokeDasharray={circumference} strokeDashoffset={offset} />
            </svg>
            <div className={styles.scoreValue}>
                <div className={styles.scoreNumber}>{score}</div>
                <div className={styles.scoreLabel}>Tổng điểm xuất</div>
            </div>
        </div>
    );
}

/* Deep Analysis Section */
function DeepAnalysisSection({ section }) {
    return (
        <div className={styles.deepSection}>
            {/* Header */}
            <div className={styles.deepSectionHeader}>
                <div className={styles.deepSectionTitle}>
                    <span>{section.sectionIcon}</span>
                    {section.sectionName}
                    {section.subtitle && (
                        <span className={styles.deepSectionSubtitle}>{section.subtitle}</span>
                    )}
                </div>
                <div className={styles.deepSectionHeaderRight}>
                    <span className={styles.deepScore}>
                        <span className={styles.deepScoreNum}>{section.score}</span>/100
                    </span>
                    <span className={`${styles.deepStatusBadge} ${getStatusClass(section.statusColor)}`}>
                        {section.status}
                    </span>
                </div>
            </div>

            {/* Body - Two Columns */}
            <div className={styles.deepSectionBody}>
                {/* Left Column */}
                <div className={styles.deepLeft}>
                    <div className={styles.deepLabel}>🔍 Phát hiện vấn đề</div>
                    <div className={styles.deepIssueText}>{section.issueDetection}</div>

                    <div className={styles.deepLabel}>💡 Lời khuyên coach</div>
                    <div className={styles.deepCoachText}>{section.coachAdvice}</div>

                    <div className={styles.deepLabel}>📋 Các bước hành động</div>
                    <div className={styles.deepActions}>
                        {section.actionSteps?.map((step, i) => (
                            <div key={i} className={styles.deepActionChip}>
                                🔹 {step}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div className={styles.deepRight}>
                    <div className={styles.deepRightTitle}>✏️ Mẫu viết lại chuyên sâu</div>

                    {/* Current */}
                    <div className={styles.rewriteBlock}>
                        <div className={`${styles.rewriteLabel} ${styles.rewriteLabelCurrent}`}>
                            {section.rewriteSample?.currentLabel || 'HIỆN TẠI'}
                        </div>
                        <div className={`${styles.rewriteText} ${styles.rewriteTextCurrent}`}>
                            {section.rewriteSample?.currentText}
                        </div>
                    </div>

                    <div className={styles.rewriteArrow}>↓</div>

                    {/* Improved */}
                    <div className={styles.rewriteBlock}>
                        <div className={`${styles.rewriteLabel} ${styles.rewriteLabelImproved}`}>
                            {section.rewriteSample?.improvedLabel || 'GỢI Ý CẢI THIỆN'}
                        </div>
                        <div className={`${styles.rewriteText} ${styles.rewriteTextImproved}`}>
                            {section.rewriteSample?.improvedText}
                        </div>
                    </div>

                    {/* Expert Tip */}
                    {section.rewriteSample?.expertTip && (
                        <div className={styles.expertTip}>
                            <span className={styles.expertTipIcon}>💬</span>
                            <span>{section.rewriteSample.expertTip}</span>
                        </div>
                    )}
                </div>
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
                <Link href="/review" className={styles.backBtn}>← Phân tích CV khác</Link>

                {/* Header */}
                <div className={styles.resultHeader}>
                    <div className={styles.candidateAvatar}>{initials}</div>
                    <div className={styles.candidateInfo}>
                        <h1>CV Insight Pro</h1>
                        <p>Phân tích CV cho: {data.candidateName}</p>
                    </div>
                </div>

                {/* Recommendation */}
                <div className={styles.recommendationBanner}>
                    <div>
                        <div className={styles.recommendationTitle}>🎯 Khuyến Nghị Ứng Tuyển</div>
                        <p className={styles.recommendationDetail}>{data.recommendationDetail}</p>
                    </div>
                    <div className={`${styles.recommendationBadge} ${getBadgeClass(data.recommendation)}`}>
                        {data.recommendation}
                    </div>
                </div>

                {/* Strategy */}
                <div className={styles.strategySection}>
                    <div className={styles.strategyTitle}>💡 Chiến lược tối ưu CV</div>
                    <div className={styles.strategyInner}>
                        <div>
                            <div className={styles.strategySummary}>{data.cvStrategy?.summary}</div>
                            <div className={styles.strategyCards}>
                                <div className={styles.strategyCard}>
                                    <div className={styles.strategyCardTitle}>✅ Tiếp cận</div>
                                    <p className={styles.strategyCardText}>{data.cvStrategy?.shouldDo}</p>
                                </div>
                                <div className={styles.strategyCard}>
                                    <div className={styles.strategyCardTitle}>☐ Không nên</div>
                                    <p className={styles.strategyCardText}>{data.cvStrategy?.shouldNotDo}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.scoreCircleWrapper}>
                            <ScoreCircle score={data.overallScore} />
                        </div>
                    </div>
                </div>

                {/* Metrics + Criteria */}
                <div className={styles.twoColumns}>
                    <div className={styles.metricsSection}>
                        <div className={styles.sectionTitle}>📊 Bản đồ 10 chỉ số CV</div>
                        <div className={styles.radarContainer}>
                            <RadarChart metrics={data.metrics || []} />
                        </div>
                        <div className={styles.metricsList}>
                            {data.metrics?.map((m, i) => (
                                <div key={i} className={styles.metricsItem}>
                                    <span className={styles.metricsItemDot} style={{ background: getScoreColor(m.score) }} />
                                    <span className={styles.metricsItemName}>{m.name}</span>
                                    <span className={styles.metricsItemScore} style={{ color: getScoreColor(m.score) }}>{m.score}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.criteriaSection}>
                        <div className={styles.sectionTitle}>📋 Chi tiết tiêu chí đánh giá</div>
                        <div className={styles.criteriaList}>
                            {data.metrics?.map((m, i) => (
                                <div key={i} className={styles.criteriaItem}>
                                    <div className={styles.criteriaScore} style={{
                                        background: m.score >= 75 ? 'var(--color-success-bg)' : m.score >= 50 ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
                                        color: m.score >= 75 ? 'var(--color-success)' : m.score >= 50 ? 'var(--color-warning)' : 'var(--color-danger)',
                                    }}>
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

                {/* Layout */}
                <div className={styles.layoutSection}>
                    <div className={styles.layoutHeader}>
                        <div className={styles.sectionTitle}>📐 Đánh giá Bố cục & Trình bày</div>
                        <div className={styles.layoutScore} style={{
                            background: data.layout?.score >= 75 ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                            color: data.layout?.score >= 75 ? 'var(--color-success)' : 'var(--color-warning)',
                        }}>
                            Layout Score: {data.layout?.score}/100
                        </div>
                    </div>
                    <div className={styles.layoutContent}>
                        <div className={styles.layoutSummary}>{data.layout?.summary}</div>
                        <div>
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

                {/* Optimization Lab Header */}
                <div className={styles.optimizationHeader}>
                    <div className={styles.optimizationHeaderTitle}>
                        🔧 XƯỞNG TỐI ƯU HÓA (OPTIMIZATION LAB)
                    </div>
                    <p className={styles.optimizationHeaderSub}>
                        Lộ trình nâng cấp chi tiết trên từng tiêu chí nội dung.
                    </p>
                </div>

                {/* Deep Analysis Sections */}
                {data.deepAnalysis?.map((section, i) => (
                    <DeepAnalysisSection key={i} section={section} />
                ))}
            </div>

            <Footer />
        </div>
    );
}
