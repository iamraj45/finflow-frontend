import React, { useContext } from 'react';
import {
  Box, Button, Typography, Modal, Select, MenuItem
} from '@mui/material';
import { CategoryContext } from '../context/CategoryContext';

const CategoryFilter = ({
  open,
  onClose,
  selectedCategory,
  setSelectedCategory,
  onApply
}) => {
  const { categories } = useContext(CategoryContext);

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
          value={selectedCategory?.id || ''}
          onChange={(e) => {
            const selected = categories.find(cat => cat.id === e.target.value);
            setSelectedCategory(selected);
          }}
        >
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
            onClick={onApply}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CategoryFilter;
