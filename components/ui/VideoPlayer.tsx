'use client';

import { useState } from 'react';
import { Skeleton } from './Skeleton';

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    src: string;
}

export function VideoPlayer({ src, className, ...props }: VideoPlayerProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={`relative w-full h-full ${className}`}>
            {isLoading && (
                <Skeleton
                    className="absolute inset-0 z-10 w-full h-full bg-linear-to-br from-gray-200 to-gray-300"
                    variant="rectangular"
                    height="100%"
                    width="100%"
                />
            )}
            <video
                src={src}
                className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                onLoadedData={() => setIsLoading(false)}
                autoPlay
                muted
                loop
                playsInline
                {...props}
            />
        </div>
    );
}
