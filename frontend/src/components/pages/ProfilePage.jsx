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
    backgroundColor: '#8EC0F9', // Changed background color to #8EC0F9
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
    color: 'white',  // Ensured text is white on this background
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
    color: 'white',
  },
  input: {
    display: 'none',
    color: 'white',
  },
  button: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
    background: '#6C9EF0', // Changed button background to #8EC0F9
    color: 'white',
    boxShadow: theme.shadows[5],
    '&:hover': {
      background: 'rgb(0, 119, 255)', // Darker shade for hover
    },
  },
  uploadButton: {
    marginTop: theme.spacing(2),
    background: 'white',
    color: '#8EC0F9', // Text color adjusted to match the form's color scheme
    border: '2px solid #8EC0F9',
    '&:hover': {
      background: 'rgb(0, 119, 255)',
      color: 'white',
    },
  },
  progress: {
    marginLeft: theme.spacing(2),
    color: 'white',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'White', // Changed text field border color
      },
      '&:hover fieldset': {
        borderColor: 'rgb(0, 119, 255)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#8EC0F9',
      },
    },
    color: 'white',
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
