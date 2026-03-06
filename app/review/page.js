'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './review.module.css';

export default function ReviewPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const jdFileInputRef = useRef(null);
    const [cvFile, setCvFile] = useState(null);
    const [jdText, setJdText] = useState('');
    const [jdFile, setJdFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('File không được vượt quá 2MB');
                return;
            }
            setCvFile(file);
            setError('');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('File không được vượt quá 2MB');
                return;
            }
            setCvFile(file);
            setError('');
        }
    };

    const handleJdFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setJdFile(file);
            // Read the JD file as text
            const reader = new FileReader();
            reader.onload = (ev) => {
                setJdText(ev.target.result);
            };
            reader.readAsText(file);
        }
    };

    const handleAnalyze = async () => {
        if (!cvFile) {
            setError('Vui lòng tải lên CV của bạn');
            return;
        }
        if (!jdText.trim()) {
            setError('Vui lòng nhập mô tả công việc (JD)');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('cv', cvFile);
            formData.append('jd', jdText);

            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Có lỗi xảy ra khi phân tích. Vui lòng thử lại.');
            }

            const data = await res.json();

            // Store result in sessionStorage and navigate to result page
            sessionStorage.setItem('analysisResult', JSON.stringify(data));
            router.push('/result');
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className={styles.reviewPage}>
            <Navbar />

            <div className={styles.reviewHeader}>
                <h1 className={styles.reviewTitle}>Review CV Miễn Phí</h1>
                <div className={styles.freeBadge}>
                    Lượt phân tích miễn phí còn lại hôm nay
                    <span className={styles.freeBadgeCount}>5</span>
                </div>
            </div>

            <div className={styles.reviewContent}>
                {/* CV Upload */}
                <div className={styles.uploadSection}>
                    <div className={styles.sectionLabel}>Tải lên CV</div>

                    {!cvFile ? (
                        <div
                            className={`${styles.uploadZone} ${dragging ? styles.uploadZoneDragging : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                        >
                            <span className={styles.uploadIcon}>📤</span>
                            <div className={styles.uploadText}>Tệp CV của bạn</div>
                            <div className={styles.uploadHint}>Kéo và thả file tại đây, hoặc click để chọn</div>
                            <div className={styles.uploadFormats}>Chỉ hỗ trợ PDF, DOCX (Tối đa 2MB)</div>
                        </div>
                    ) : (
                        <div className={styles.filePreview}>
                            <div className={styles.fileInfo}>
                                <div className={styles.fileIcon}>📄</div>
                                <div>
                                    <div className={styles.fileName}>{cvFile.name}</div>
                                    <div className={styles.fileSize}>{formatFileSize(cvFile.size)}</div>
                                </div>
                            </div>
                            <button className={styles.removeFile} onClick={() => setCvFile(null)} aria-label="Remove file">
                                ✕
                            </button>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>

                {/* Job Description */}
                <div className={styles.jdSection}>
                    <div className={styles.sectionLabel}>Mô tả công việc</div>
                    <textarea
                        className={styles.jdTextarea}
                        placeholder="Dán nội dung mô tả công việc (JD) tại đây...&#10;Ví dụ: Yêu cầu 3 năm kinh nghiệm React, Node.js..."
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                    />
                    <div className={styles.orDivider}>HOẶC</div>
                    <div
                        className={styles.jdUploadZone}
                        onClick={() => jdFileInputRef.current?.click()}
                    >
                        <span className={styles.uploadIcon}>📤</span>
                        <div className={styles.uploadText}>Tải tệp mô tả công việc (JD)</div>
                        <div className={styles.uploadHint}>Kéo và thả file tại đây, hoặc click để chọn</div>
                        <div className={styles.uploadFormats}>Chỉ hỗ trợ PDF, DOCX (Tối đa 2MB)</div>
                    </div>
                    <input
                        ref={jdFileInputRef}
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleJdFileChange}
                        style={{ display: 'none' }}
                    />
                </div>

                {error && <div className={styles.errorMsg}>{error}</div>}

                {/* Analyze Button */}
                <button
                    className={`${styles.analyzeBtn} ${loading ? styles.analyzeBtnLoading : ''}`}
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className={styles.spinner} />
                            Đang phân tích...
                        </>
                    ) : (
                        '🔍 Bắt đầu phân tích'
                    )}
                </button>
            </div>

            <Footer />
        </div>
    );
}
