import { useState, useEffect } from "react";

export default function LazyImage({ src, alt, className }) {
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setImageSrc(src);
        img.onerror = () => setImageSrc("/default-news.jpg");
    }, [src]);

    return (
        <img
            src={imageSrc || "/placeholder-news.jpg"}
            alt={alt}
            className={className}
            loading="lazy"
        />
    );
}