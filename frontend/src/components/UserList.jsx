import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, Button, Box, Avatar, Chip, IconButton, TextField, InputAdornment,
  CircularProgress, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { 
  PersonOutline, Refresh, Search, FilterList, MoreVert, Check, 
  Block, Edit, Delete, CheckCircle, Cancel
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useUserStore } from './store/zuser';
import { toast } from 'react-toastify'; // Ensure you import toast if you use it

// Styled components (unchanged)
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  borderRadius: '12px',
  overflow: 'hidden',
  marginBottom: theme.spacing(4)
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const SearchFilterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 3)
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: theme.palette.text.secondary
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: '4px',
  fontWeight: 500,
  backgroundColor: status === 'active' ? theme.palette.success.light : theme.palette.grey[300],
  color: status === 'active' ? theme.palette.success.dark : theme.palette.grey[700]
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.dark,
  width: 36,
  height: 36,
  marginRight: theme.spacing(1.5)
}));

const UserRow = styled(TableRow)(({ theme, isActive }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  opacity: isActive ? 1 : 0.7
}));

const UserCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2)
}));

const NameCell = styled(Box)({
  display: 'flex',
  alignItems: 'center'
});

const UserList = () => {
  // Use local state only for loading, search term, and confirmation dialog.
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, userId: null, action: '' });

  // Destructure users and fetchUsers from your Zustand store.
  const { users, fetchUsers, setUsers } = useUserStore();

  useEffect(() => {
    const getUsers = async () => {
      try {
        await fetchUsers();
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []); // Only run once on mount

  const handleActivationToggle = async (userId, isActive) => {
    setConfirmDialog({
      open: true,
      userId,
      action: isActive ? 'deactivate' : 'activate',
      isActive
    });
  };

  const confirmActivationToggle = async () => {
    const { userId, isActive } = confirmDialog;
    try {
      await axios.patch(`/api/auth/users/${userId}`, { 
        isActive: !isActive, 
        activationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) 
      });
      
      // Update the user status in your Zustand store.
      setUsers(users.map(user => 
        user._id === userId ? { 
          ...user, 
          isActive: !isActive, 
          activationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) 
        } : user
      ));
      
      setConfirmDialog({ open: false, userId: null, action: '' });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error("Failed to update user status.");
    }
  };  

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <StyledTableContainer component={Paper}>
        <HeaderBox>
          <Box display="flex" alignItems="center">
            <PersonOutline sx={{ mr: 1.5, color: 'primary.main' }} />
            <Typography variant="h5" component="h1" fontWeight="600">
              User Management
            </Typography>
          </Box>
          <Tooltip title="Refresh user list">
            <IconButton onClick={fetchUsers} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </HeaderBox>

        <SearchFilterBox>
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              )
            }}
          />
          <Tooltip title="Filter options">
            <IconButton>
              <FilterList />
            </IconButton>
          </Tooltip>
        </SearchFilterBox>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      No users found matching your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <UserRow key={user._id} isActive={user.isActive}>
                    <UserCell>
                      <NameCell>
                        <UserAvatar>{getInitials(user.firstName, user.lastName)}</UserAvatar>
                        <Box>
                          <Typography variant="body1" fontWeight="500">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user._id.substring(0, 8)}...
                          </Typography>
                        </Box>
                      </NameCell>
                    </UserCell>
                    <UserCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </UserCell>
                    <UserCell align="center">
                      <StatusChip 
                        status={user.isActive ? 'active' : 'inactive'}
                        icon={user.isActive ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                        label={user.isActive ? 'Active' : 'Inactive'} 
                        size="small"
                      />
                    </UserCell>
                    <UserCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title={user.isActive ? "Deactivate user" : "Activate user"}>
                          <IconButton 
                            size="small"
                            color={user.isActive ? "error" : "success"}
                            onClick={() => handleActivationToggle(user._id, user.isActive)}
                          >
                            {user.isActive ? <Block fontSize="small" /> : <Check fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </UserCell>
                  </UserRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Typography variant="body2" color="text.secondary">
            Total Users: {filteredUsers.length}
          </Typography>
        </Box>
      </StyledTableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, userId: null, action: '' })}>
        <DialogTitle>
          {confirmDialog.action === 'activate' ? 'Activate User' : 'Deactivate User'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmDialog.action} this user?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, userId: null, action: '' })}>
            Cancel
          </Button>
          <Button 
            color={confirmDialog.action === 'activate' ? 'success' : 'error'} 
            variant="contained" 
            onClick={confirmActivationToggle}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserList;
