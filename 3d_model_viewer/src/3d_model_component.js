import React, { useEffect, useRef } from 'react';

function ModelComponent() {
  const containerRef = useRef(null);

  useEffect(() => {

    const checkSDKInterval = setInterval(() => {
      if (window.ModelSDK) {
        clearInterval(checkSDKInterval);
        
        const sdk = new window.ModelSDK();

        sdk.render(containerRef.current, {
          modelName: 'bmw',
          autoRotate: 'true',
          cameraControls: 'true',
          width: '500px',
          height: '300px'
        });
      }
    }, 100);

    return () => {
      clearInterval(checkSDKInterval);
    };
  }, []);

  return (
    <div>
      <h1>3D Model SDK</h1>
      <div ref={containerRef}>
        Loading 3D model...
      </div>
    </div>
  );
}

export default ModelComponent;