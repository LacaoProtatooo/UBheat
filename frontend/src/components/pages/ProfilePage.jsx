import React, { useState } from 'react';
import { Container, TextField, Button, Avatar, Typography, Grid, Paper, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CloudUpload } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[10],
    background: 'linear-gradient(145deg, #ffffff, #e6f3ff)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[20],
    },
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    margin: 'auto',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: theme.shadows[5],
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: theme.shadows[10],
    },
  },
  input: {
    display: 'none',
  },
  button: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: 'white',
    boxShadow: theme.shadows[5],
    '&:hover': {
      background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
    },
  },
  uploadButton: {
    marginTop: theme.spacing(2),
    background: 'white',
    color: '#2196F3',
    border: '2px solid #2196F3',
    '&:hover': {
      background: '#2196F3',
      color: 'white',
    },
  },
  progress: {
    marginLeft: theme.spacing(2),
    color: 'white',
  },
  title: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#2196F3',
      },
      '&:hover fieldset': {
        borderColor: '#1976D2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2196F3',
      },
    },
  },
}));

const ProfilePage = () => {
  const classes = useStyles();
  const [name, setName] = useState('John Doe');
  const [number, setNumber] = useState('+1234567890');
  const [avatar, setAvatar] = useState('https://via.placeholder.com/150');
  const [bio, setBio] = useState('I love coding and designing!');
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Updated Profile:', { name, number, avatar, bio });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Container maxWidth="sm">
      <Paper className={classes.root}>
        <Typography variant="h4" align="center" className={classes.title}>
          Edit Profile
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} align="center">
            <input
              accept="image/*"
              className={classes.input}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <Avatar src={avatar} className={classes.avatar} />
            </label>
            <label htmlFor="avatar-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                className={classes.uploadButton}
              >
                Upload Avatar
              </Button>
            </label>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={classes.textField}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className={classes.textField}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              variant="outlined"
              multiline
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={classes.textField}
            />
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className={classes.button}
              disabled={isLoading}
            >
              Save Changes
              {isLoading && <CircularProgress size={24} className={classes.progress} />}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;