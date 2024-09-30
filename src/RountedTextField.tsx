import { ChangeEvent, KeyboardEvent } from 'react';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Define custom hook for styles
const useStyles = makeStyles((theme) => ({
  roundedInput: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '1.5rem',
      color: "#fff",
      height: "2rem",
      transition: 'background-color 0.3s ease, height 0.3s ease',
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--text-color)',
      },
      '&:hover fieldset': {
        background: '#2222',
      },
    },

    // Change the label color when focused
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'red', // Label color when focused
      height: "2rem",
    },
    // Media query for mobile responsiveness
    // @ts-ignore
    [theme.breakpoints.down('sm')]: { // Adjust according to your breakpoints
      '& .MuiOutlinedInput-root': {
        fontSize: '0.8rem', // Smaller font size for mobile devices
      },
      '& .MuiInputLabel-root': {
        fontSize: '0.8rem', // Adjust label size if necessary
      },
    },
  },
}));

interface RoundedInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
}

// Modify RoundedInput to accept props
function RoundedInput({ value, onChange, onKeyDown, placeholder }: RoundedInputProps) {
  const classes = useStyles();

  return (
    <TextField
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown} // Ensure this is included
      placeholder={placeholder}
      className={classes.roundedInput}
      style={{ width: "100%" }}
    />
  );
}

export default RoundedInput;
