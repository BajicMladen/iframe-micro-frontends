import React, { useState, useEffect, useRef } from 'react';

interface IframeErrorBoundaryProps {
  src: string;
  title: string;
  name: string;
  id: string;
  style?: React.CSSProperties;
  onError?: (error: Error) => void;
}

const IframeErrorBoundary: React.FC<IframeErrorBoundaryProps> = ({
  src,
  title,
  name,
  id,
  style,
  onError,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set a timeout for iframe loading
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        const error = new Error(`iframe ${name} failed to load within timeout`);
        console.error(error);
        setHasError(true);
        setIsLoading(false);
        if (onError) {
          onError(error);
        }
      }
    }, 30000); // 30 second timeout

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, name, onError]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleError = () => {
    const error = new Error(`Failed to load iframe: ${name}`);
    console.error(error);
    setHasError(true);
    setIsLoading(false);
    if (onError) {
      onError(error);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const retry = () => {
    setHasError(false);
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = src;
    }
  };

  if (hasError) {
    return (
      <div
        className='flex flex-col items-center justify-center bg-yellow-50 border border-yellow-200 rounded-lg m-4 p-8'
        style={style}
      >
        <h3 className='text-xl font-bold text-yellow-700 mb-4'>
          Failed to load {title}
        </h3>
        <p className='text-gray-600 mb-4'>
          The microfrontend could not be loaded. Please check your connection.
        </p>
        <button
          onClick={retry}
          className='px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className='flex items-center justify-center bg-gray-100'
          style={style}
        >
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent'></div>
            <p className='mt-4 text-gray-600'>Loading {title}...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        name={name}
        id={id}
        style={{ ...style, display: isLoading ? 'none' : 'block' }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
};

export default IframeErrorBoundary;
