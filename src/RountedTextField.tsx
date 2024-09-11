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

      // Border color when focused
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--text-color)', // Change this color to any you prefer
      },
    },

    // Change the label color when focused
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'red', // Label color when focused
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
