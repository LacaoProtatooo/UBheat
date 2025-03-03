import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleActivationToggle = async (userId, isActive) => {
    try {
      await axios.patch(`/api/users/${userId}`, { isActive: !isActive, activationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
      setUsers(users.map(user => user._id === userId ? { ...user, isActive: !isActive, activationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) } : user));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, padding: 2 }}>
        User List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color={user.isActive ? 'secondary' : 'primary'}
                  onClick={() => handleActivationToggle(user._id, user.isActive)}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;