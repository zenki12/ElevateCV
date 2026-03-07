'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.navContent}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>E</span>
                    <span className={styles.logoText}>ElevateCV</span>
                </Link>

                <button
                    className={styles.menuToggle}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>

                <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
                    <li>
                        <Link href="/#features" className={styles.navLink} onClick={() => setMenuOpen(false)}>
                            ✦ Tính năng
                        </Link>
                    </li>
                    <li>
                        <Link href="/#faq" className={styles.navLink} onClick={() => setMenuOpen(false)}>
                            Câu hỏi
                        </Link>
                    </li>
                    <li>
                        <Link href="/review" className={styles.navCta} onClick={() => setMenuOpen(false)}>
                            🚀 Phân tích CV
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
