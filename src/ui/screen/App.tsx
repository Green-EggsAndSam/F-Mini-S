import './App.css'
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

function App() {

  const [screen, setScreen] = useState<number>(0);

  const screens : Map<string, number> = new Map();
  screens.set("match", 0);
  screens.set("matchResults", 1);
  screens.set("ranks", 2);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [ mirrorStatus, setMirrorStatus ] = useState<boolean>(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const webcamRef = useRef<Webcam | null>(null);

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
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then(handleDevices)
      .catch(err => console.error("Error accessing media devices:", err));
  }, [handleDevices]);

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(event.target.value);
  };

  const toggleMirror = () => {
    setMirrorStatus(!mirrorStatus);
  }

  const videoConstraints = {
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
    width: 1280,
    height: 720
  };

  switch(screen){
    case screens.get("matchResults") :

    break;

    case screens.get("ranks") :

    break;

    default :
      return (
        <>
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
              <button onClick={toggleMirror}
              className='mirrorButton'
              >Toggle Mirror</button>

              <button onClick={() => setScreen(1)}
              >change screen</button>
            </div>
          )}
            <Webcam
                    audio={false}
                    mirrored={mirrorStatus}
                    ref={webcamRef}
                    videoConstraints={videoConstraints}
                    forceScreenshotSourceSize={true}
            />
        </>
      )
  }
}

export default App;