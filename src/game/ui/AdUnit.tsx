'use client';

import React, { useEffect } from 'react';

interface AdUnitProps {
    adSlot: string;
    adFormat?: string;
    fullWidthResponsive?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({
    adSlot,
    adFormat = 'auto',
    fullWidthResponsive = true,
    style = { display: 'block' },
    className = ""
}) => {
    const adRef = React.useRef<HTMLModElement>(null);

    useEffect(() => {
        // Wait for layout to be settled
        let attempts = 0;
        const maxAttempts = 5;

        const tryPush = () => {
            if (adRef.current && adRef.current.offsetWidth > 0) {
                try {
                    // @ts-ignore
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (err) {
                    // Fail silently or log once
                    if (attempts === 0) console.warn('AdSense initial push failed, retrying...', err);
                }
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(tryPush, 200); // Retry after 200ms
            }
        };

        const timer = setTimeout(tryPush, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`ad-container ${className}`} style={{ minWidth: '160px' }}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={style}
                data-ad-client="ca-pub-5536083857370761"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
            />
        </div>
    );
};

export default AdUnit;
