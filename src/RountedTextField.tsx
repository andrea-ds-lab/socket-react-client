import { ChangeEvent, KeyboardEvent } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Define custom hook for styles
const useStyles = makeStyles((theme) => ({
  roundedInput: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '1.5rem', // Rounded corners
      color: "#fff", // Default text color
      height: "2rem",
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

    // Media query for mobile responsiveness
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
