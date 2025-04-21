import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, Typography, Modal, Select, MenuItem
} from '@mui/material';
import { CategoryContext } from '../context/CategoryContext';

const CategoryFilter = ({
  open,
  onClose,
  selectedCategory,
  onApply
}) => {
  const { categories } = useContext(CategoryContext);

  const [localSelectedCategory, setLocalSelectedCategory] = useState(null);

  // Sync local state when modal opens or selectedCategory changes
  useEffect(() => {
    if (open) {
      setLocalSelectedCategory(selectedCategory || null);
    }
  }, [open, selectedCategory]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
          outline: 'none',
          minWidth: 300,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Select Category
        </Typography>
        <Select
          fullWidth
          displayEmpty
          value={localSelectedCategory?.id || ''}
          onChange={(e) => {
            const selected = categories.find(cat => cat.id === e.target.value);
            setLocalSelectedCategory(selected);
          }}
        >
          <MenuItem value="" disabled>
            Select
          </MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#130037', '&:hover': { backgroundColor: '#2d005c' } }}
            disabled={!localSelectedCategory}
            onClick={() => {
              onApply(localSelectedCategory);
            }}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CategoryFilter;
