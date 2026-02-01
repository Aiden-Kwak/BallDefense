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
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className={`ad-container ${className}`} style={{ minWidth: '160px', minHeight: '100px' }}>
            <ins
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
