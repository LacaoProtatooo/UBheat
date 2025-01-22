import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  TextField,
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CloseIcon from '@mui/icons-material/Close';
import Reviews from '@mui/icons-material/Reviews';
import { useDispatch } from 'react-redux';
import { createReview } from '../store/reviewSlice';

const ReviewModal = ({ isOpen, onClose, figurine, orderid }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [figId, setFigId] = useState('');
    const [userid, setUserid] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve user from localStorage
  const dispatch = useDispatch();

  // Set figurine ID when modal opens
  useEffect(() => {
    if (figurine) {
      setFigId(figurine._id);
    }
    if(user){
      setUserid(user._id);
    }
  }, [figurine, user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      console.error('User not logged in or invalid user data.');
      return;
    }

    // const userid = user._id;
    console.log({ rating, comment, userid, figId, orderid });

    dispatch(createReview({ figId, comment, rating, userid, orderid }));
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Reviews /> Write a Review
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Product Section */}
        <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 3 }}>
          <img
            src={figurine.images[0]?.url || '/default-placeholder.png'}
            alt={figurine.name}
            style={{ width: '128px', height: '128px', objectFit: 'cover', borderRadius: '8px' }}
          />
          <Box>
            <Typography variant="h6">{figurine.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Origin: {figurine.origin}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
              $ {figurine.price}
            </Typography>
          </Box>
        </Box>

        {/* Review Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* User Information */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user?.image || '/default-avatar.png'}
              alt={`${user?.firstname || 'Guest'} ${user?.lastname || ''}`}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="subtitle1">{user ? `${user.firstname} ${user.lastname}` : 'Guest'}</Typography>
          </Box>

          {/* Rating Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton
                key={star}
                onClick={() => setRating(star)}
                size="large"
                sx={{ p: 0.5 }}
              >
                {star <= rating ? (
                  <StarIcon sx={{ color: 'gold' }} />
                ) : (
                  <StarBorderIcon sx={{ color: 'grey.400' }} />
                )}
              </IconButton>
            ))}
          </Box>

          {/* Comment Field */}
          <TextField
            multiline
            rows={4}
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            variant="outlined"
          />

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Submit Review
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
