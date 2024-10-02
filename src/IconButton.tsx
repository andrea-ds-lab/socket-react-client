import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Group, SmartToy } from '@mui/icons-material';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

const StyledButton = styled('button')<{ isActive: boolean }>(({ isActive }) => ({
  backgroundColor: isActive ? '#FFD700' : '#4F5D4F',
  backgroundImage: isActive ? 'radial-gradient(circle at 50% 50%, #FFF, #FFD700 80%)' : 'none',
  color: '#E0E2DB',
  border: 'none',
  borderRadius: '50%',
  padding: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.6s ease, box-shadow 0.3s ease',
  width: '3rem',
  height: '3rem',
  boxShadow: isActive ? '0 0 1rem rgba(255, 215, 0, 0.8), inset 0 0 0.3rem rgba(255, 255, 255, 0.5)' : '0 0.25rem 0.5rem rgba(0, 0, 0, 0.2)',
  '&:hover': {
    backgroundColor: isActive ? 'lightgoldenrodyellow' : '#3A4D40',
    boxShadow: isActive ? '0 0 2rem rgba(255, 215, 0, 1), inset 0 0 5px rgba(255, 255, 255, 0.7)' : '0 4px 8px rgba(0, 0, 0, 0.2)',
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
        <SmartToy sx={{ color: 'var(--highlight-color-light)' }} />
      ) : (
        <Group sx={{ color: '#E0E2DB' }} />
      )}
    </StyledButton>
  );
}

export default IconButton;
