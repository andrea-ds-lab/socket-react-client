import { ChangeEvent, KeyboardEvent } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Define custom hook for styles
const useStyles = makeStyles({
  roundedInput: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '1.5rem', // Rounded corners
      color: "#fff", // Default text color
      height: "2rem",
      background: "",
      transition: 'background-color 0.3s ease, height 0.3s ease', // Smooth transition for background and height changes
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--text-color)', // Change this color to any you prefer
      },
      '&:hover fieldset': {
        background: '#2222', // Border color on hover
      },


    },

    // Change the label color when focused
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'red', // Label color when focused
      height: "2rem",
    },

    backgroundContainer: {
      transition: 'height 0.3s ease', // Smooth transition for background height changes
      background: 'rgba(0, 0, 0, 0.1)', // Example background
    },


  },
});

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
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={classes.roundedInput}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {/* You can add any icons or elements here if needed */}
          </InputAdornment>
        ),
      }}
    />
  );
}

export default RoundedInput;
