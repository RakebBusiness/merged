import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { Eye, EyeOff, Camera, CameraOff } from 'lucide-react';

interface FocusTrackerProps {
  onFocusUpdate?: (focusTime: number, totalTime: number) => void;
  autoStart?: boolean;
}

export default function FocusTracker({ onFocusUpdate, autoStart = false }: FocusTrackerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [focusTime, setFocusTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [focusScore, setFocusScore] = useState(0);
  const [cameraError, setCameraError] = useState('');

  const detectorRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastCheckTimeRef = useRef<number>(Date.now());
  const lastFocusCheckRef = useRef<number>(Date.now());
  const focusTimeRef = useRef<number>(0);
  const totalTimeRef = useRef<number>(0);

  useEffect(() => {
    if (autoStart) {
      startTracking();
    }
    return () => {
      stopTracking();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTracking) {
        const currentTime = Date.now();
        const elapsed = (currentTime - lastCheckTimeRef.current) / 1000;
        totalTimeRef.current += elapsed;
        lastCheckTimeRef.current = currentTime;

        setTotalTime(Math.floor(totalTimeRef.current));

        const score = totalTimeRef.current > 0
          ? Math.round((focusTimeRef.current / totalTimeRef.current) * 100)
          : 0;
        setFocusScore(score);

        if (onFocusUpdate) {
          onFocusUpdate(Math.floor(focusTimeRef.current), Math.floor(totalTimeRef.current));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking, onFocusUpdate]);

  const startTracking = async () => {
    try {
      setCameraError('');
      
      // Initialize TensorFlow.js backend first
      await tf.setBackend('webgl');
      await tf.ready();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Use TFjs runtime instead of MediaPipe for better reliability
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshTfjsModelConfig = {
        runtime: 'tfjs',
        maxFaces: 1,
        refineLandmarks: false,
      };

      detectorRef.current = await faceLandmarksDetection.createDetector(model, detectorConfig);
      lastCheckTimeRef.current = Date.now();
      lastFocusCheckRef.current = Date.now();
      setIsTracking(true);
      
      // Start detection loop after detector is ready
      detectFocus();
    } catch (error) {
      console.error('Error starting focus tracker:', error);
      setCameraError('Unable to access camera or initialize face detection. Please allow camera permissions.');
    }
  };

  const stopTracking = () => {
    setIsTracking(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    if (detectorRef.current) {
      detectorRef.current.dispose();
      detectorRef.current = null;
    }
  };

  const detectFocus = async () => {
    // Don't check isTracking state here - check refs instead
    if (!detectorRef.current || !videoRef.current) return;

    try {
      const faces = await detectorRef.current.estimateFaces(videoRef.current, {
        flipHorizontal: false,
      });

      const hasFace = faces.length > 0;
      let isLookingAtScreen = false;

      if (hasFace) {
        const face = faces[0];
        const keypoints = face.keypoints;

        const leftEye = keypoints.filter((kp: any) =>
          kp.name?.includes('leftEye') || (kp.x > 200 && kp.x < 280 && kp.y > 180 && kp.y < 220)
        );
        const rightEye = keypoints.filter((kp: any) =>
          kp.name?.includes('rightEye') || (kp.x > 360 && kp.x < 440 && kp.y > 180 && kp.y < 220)
        );

        const nose = keypoints.find((kp: any) => kp.name === 'noseTip') || keypoints[1];

        if (leftEye.length > 0 && rightEye.length > 0 && nose) {
          const eyeDistance = Math.abs(leftEye[0].x - rightEye[0].x);
          const headAngleX = Math.abs(nose.x - 320);
          const headAngleY = Math.abs(nose.y - 240);

          isLookingAtScreen = eyeDistance > 50 && headAngleX < 100 && headAngleY < 100;
        }
      }

      setIsFocused(isLookingAtScreen);

      if (isLookingAtScreen) {
        const currentTime = Date.now();
        const elapsedSinceFocusCheck = (currentTime - lastFocusCheckRef.current) / 1000;
        focusTimeRef.current += elapsedSinceFocusCheck;
        setFocusTime(Math.floor(focusTimeRef.current));
        lastFocusCheckRef.current = currentTime;
      } else {
        // Update lastFocusCheckRef even when not focused to keep time accurate
        lastFocusCheckRef.current = Date.now();
      }

      if (canvasRef.current && videoRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.strokeStyle = isLookingAtScreen ? '#10b981' : '#ef4444';
          ctx.lineWidth = 3;
          ctx.strokeRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    } catch (error) {
      console.error('Error detecting focus:', error);
    }

    animationFrameRef.current = requestAnimationFrame(detectFocus);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <Camera className="w-6 h-6 text-blue-600" />
          <span>Focus Tracker</span>
        </h3>

        <button
          onClick={isTracking ? stopTracking : startTracking}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
            isTracking
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isTracking ? (
            <>
              <CameraOff className="w-4 h-4" />
              <span>Stop Tracking</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>Start Tracking</span>
            </>
          )}
        </button>
      </div>

      {cameraError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{cameraError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full rounded-lg bg-gray-900"
            style={{ display: isTracking ? 'block' : 'none' }}
            width="640"
            height="480"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            width="640"
            height="480"
          />
          {!isTracking && (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Camera not active</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3 p-4 bg-gray-50 rounded-lg">
            {isFocused ? (
              <>
                <Eye className="w-8 h-8 text-green-600" />
                <span className="text-lg font-semibold text-green-600">Focused</span>
              </>
            ) : (
              <>
                <EyeOff className="w-8 h-8 text-red-600" />
                <span className="text-lg font-semibold text-red-600">Not Focused</span>
              </>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Focus Statistics</h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Focus Score</span>
                  <span className="font-semibold text-blue-600">{focusScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${focusScore}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-gray-600 mb-1">Focus Time</p>
                  <p className="text-xl font-bold text-green-600">{formatTime(focusTime)}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-gray-600 mb-1">Total Time</p>
                  <p className="text-xl font-bold text-gray-900">{formatTime(totalTime)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Privacy:</strong> All processing happens in your browser. No video data is sent to servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}