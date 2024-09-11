import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { PowerSettingsNew, WorkspacePremium } from '@mui/icons-material';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

const StyledButton = styled('button')<{ isActive: boolean }>(({ isActive }) => ({
  backgroundColor: '#4F5D4F',
  color: '#E0E2DB', /* Text color */
  border: 'none',
  borderRadius: '50%', /* Fully rounded button */
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem', /* Adjust size for the icon */
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.6s ease', /* Updated transition */
  width: '3rem', /* Fixed width for the button */
  height: '3rem', /* Fixed height for the button */
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', /* Optional shadow for 3D effect */
  '&:hover': {
    backgroundColor: '#3A4D40', /* Darker background on hover */
  },
  transform: isActive ? 'rotateY(180deg) scale(1)' : 'rotateY(0deg) scale(0.9)',
}));

function IconButton({ onClick, ...rest }: IconButtonProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(prev => !prev);
    if (onClick) onClick();
  };

  return (
    <StyledButton isActive={isActive} onClick={handleClick} {...rest}>
      {isActive ? (
        <WorkspacePremium sx={{ color: 'var(--highlight-color-light)' }} />
      ) : (
        <PowerSettingsNew sx={{ color: '#E0E2DB' }} />
      )}
    </StyledButton>
  );
}

export default IconButton;
