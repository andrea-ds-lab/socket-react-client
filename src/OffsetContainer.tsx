import React from 'react';

// TypeScript interface for component props
interface OffsetContainerProps {
  children: React.ReactNode; // Accept any valid React child elements
}

// Functional React component with children
function OffsetContainer({ children }: OffsetContainerProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          top: '0.3rem',
          left: '0.3rem',
          width: 'calc(100%)',
          height: 'calc(100%)',
          backgroundColor: 'var(--highlight-color-light)',
          borderRadius: "0 0 0.7rem 0",
          zIndex: 2, // Ensure it is behind the foreground container
        }}
      >
        {/* Background content */}
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: 'var(--background-color)',
          borderRadius: "0 0 2rem 0",
          zIndex: 2,
        }}
      >
        {/* Foreground content */}
        {children}
      </div>
    </div>
  );
}

export default OffsetContainer;
