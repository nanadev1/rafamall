/* ============================================
   Terms Page Interactive Elements
   ============================================ */

/* Warning Box Dismiss */
.warning-box {
    position: relative;
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.warning-dismiss {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-tertiary);
    transition: color 0.3s ease;
}

.warning-dismiss:hover {
    color: var(--danger);
}

/* Pricing Cards */
.pricing-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Shipping Items */
.shipping-item {
    transition: transform 0.3s ease;
}

/* Conduct Items */
.conduct-item {
    transition: all 0.3s ease;
}

/* Acceptance Banner */
.acceptance-banner {
    transition: opacity 0.3s ease;
}

.acceptance-banner .btn {
    transition: all 0.3s ease;
}

.acceptance-banner .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Collapsible Sections (Mobile) */
@media (max-width: 768px) {
    .terms-block h2 {
        cursor: pointer;
        user-select: none;
    }
    
    .terms-block h2 i {
        transition: transform 0.3s ease;
    }
}

/* Print Styles */
@media print {
    .header,
    .footer,
    .page-header .btn,
    .print-terms-btn,
    .acceptance-banner .btn,
    .warning-dismiss {
        display: none !important;
    }
    
    .terms-block {
        break-inside: avoid;
        page-break-inside: avoid;
    }
    
    .warning-box {
        border: 1px solid #ccc;
        background: #f9f9f9;
    }
}