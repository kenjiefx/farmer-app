import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";

interface CameraFeedProps {
  constraints?: MediaStreamConstraints;
  className?: string;
  onStreamStart?: (stream: MediaStream) => void;
  onError?: (error: Error) => void;
}

// 1. Stable default constraints object (outside component memory)
const DEFAULT_CONSTRAINTS: MediaStreamConstraints = {
  video: true,
  audio: false,
};

export const CameraFeed: React.FC<CameraFeedProps> = ({
  constraints = DEFAULT_CONSTRAINTS,
  className = "",
  onStreamStart,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  // 2. Prevent primitive/object re-creation loops by stringifying or memoizing constraints
  const constraintsKey = JSON.stringify(constraints);
  const stableConstraints = useMemo(() => constraints, [constraintsKey]);

  // Safely stop all tracks and clear srcObject
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  // Request camera access and attach stream
  const startCamera = useCallback(async () => {
    // Keep an active stream if it's already running fine
    if (streamRef.current && streamRef.current.active) {
      return;
    }
    stopStream();
    setError(null);
    try {
      const mediaStream =
        await navigator.mediaDevices.getUserMedia(stableConstraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setIsStreaming(true);
      onStreamStart?.(mediaStream);
    } catch (err) {
      const cameraError = err instanceof Error ? err : new Error(String(err));
      console.error("Camera access error:", cameraError);
      setError(cameraError.message || "Failed to access camera");
      onError?.(cameraError);
    }
  }, [stableConstraints, stopStream, onStreamStart, onError]);

  useEffect(() => {
    startCamera();

    return () => {
      stopStream();
    };
  }, [startCamera, stopStream]);

  return (
    <div
      className={`camera-feed-container ${className}`}
      style={{ position: "relative", width: "50px" }}
    >
      {error && (
        <div
          role="alert"
          style={{ color: "red", padding: "10px", border: "1px solid red" }}
        >
          Camera Error: {error}
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "50px",
          height: "auto",
          backgroundColor: "#000",
          borderRadius: "8px",
          display: isStreaming ? "block" : "none",
        }}
      />

      {!isStreaming && !error && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          Requesting camera access...
        </div>
      )}
    </div>
  );
};
