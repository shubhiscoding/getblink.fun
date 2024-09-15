import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  subtext?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ subtext = 'Loading...' }) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-icon-wrapper">
          <Loader2 className="loading-icon" />
        </div>
        <p className="loading-text">{subtext}</p>
      </div>
      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          z-index: 9999;
        }
        .loading-content {
          text-align: center;
        }
        .loading-icon-wrapper {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        .loading-icon {
          width: 48px;
          height: 48px;
          color: white;
        }
        .loading-text {
          margin-top: 16px;
          color: white;
          font-size: 16px;
          font-weight: 500;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
