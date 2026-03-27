import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

export const CameraSelector = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const webcamRef = useRef<Webcam>(null);

  const handleDevices = React.useCallback(
    (mediaDevices: MediaDeviceInfo[]) => {
      const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    },
    [selectedDeviceId, setDevices]
  );

  useEffect(() => {
    // Request permission to access media devices and enumerate them
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then(handleDevices)
      .catch(err => console.error("Error accessing media devices:", err));
  }, [handleDevices]);

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(event.target.value);
  };

  const videoConstraints = {
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
    width: 1280,
    height: 720
  };

  return (
    <div>
      {devices.length > 0 && (
        <div>
          <label htmlFor="camera-select">Select Camera: </label>
          <select id="camera-select" onChange={handleDeviceChange} value={selectedDeviceId}>
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>
      )}
      <Webcam
        audio={false}
        ref={webcamRef}
        videoConstraints={videoConstraints}
        forceScreenshotSourceSize={true}
      />
    </div>
  );
};

export default CameraSelector;
