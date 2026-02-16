"use client";

export function WaveSeparator({ position, fill }: { position: "top" | "bottom"; fill: string }) {
    return (
        <svg
            className={`block w-full h-[84px] ${position === "top" ? "-mt-[1px]" : "-mb-[1px]"}`}
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
        >
            {position === "top" ? (
                <path
                    d="M0,64L80,64C160,64,320,64,480,74.7C640,85,800,107,960,101.3C1120,96,1280,64,1360,48L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
                    fill={fill}
                />
            ) : (
                <path
                    d="M0,32L80,48C160,64,320,96,480,101.3C640,107,800,85,960,74.7C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                    fill={fill}
                />
            )}
        </svg>
    );
}
