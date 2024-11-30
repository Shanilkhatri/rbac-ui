import React, { useEffect, useState } from 'react';
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from '../services/userService';
import { fetchRoles } from '../services/roleService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  TableSortLabel,
  TableContainer,
  Paper,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: '',
    email: '',
    role: '',
    status: 'Inactive',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    role: false,
    status: false,
  });

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
      setFilteredUsers(data); // Set initial users and filtered users
    });
    fetchRoles().then((data) => setRoles(data));
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: (e.target.value).toLowerCase() });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>, field: string) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleOpen = (
    user: any = { id: null, name: '', email: '', role: '', status: 'Active' }
  ) => {
    setErrors({ name: false, email: false, role: false, status: false });
    setForm(user);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    const validationErrors: any = {
      name: form.name.trim() === '' || !/^[A-Za-z]+([ '-][A-Za-z]+)*$/.test(form.name),
      email: form.email.trim() === '' || !/^\S+@\S+\.\S+$/.test(form.email), // Email regex validation
      role: form.role.trim() === '',
      status: form.status.trim() === '',
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).includes(true)) {
      return; // Stop if validation errors exist
    }

    const selectedRole = roles.find((role) => role.name === form.role);
    if (!selectedRole) {
      alert('Invalid role selected!');
      return;
    }

    if (form.id) {
      await updateUser(form);
    } else {
      const newUser = {
        ...form,
        id: `${Math.floor(Math.random() * 1000000)}`,
      };
      await createUser(newUser);
    }

    const updatedUsers = await fetchUsers();
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    handleClose();
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    const updatedUsers = await fetchUsers();
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    const filtered = users.filter((user) =>
      [user.name, user.email]
        .join(' ')
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSortRequest = (property: string) => {
    const isAsc = orderBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const isAscSort = sortDirection === 'asc';
      if (property === 'name') {
        return isAscSort
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (property === 'email') {
        return isAscSort
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      }
      return 0;
    });
    setFilteredUsers(sortedUsers);
  };

  return (
    <div>
      <h1>Users Management</h1>
      <div>
        <TextField
          label="Search Users"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name or email"
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </div>

      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add User
      </Button>
      
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSortRequest('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? sortDirection : 'asc'}
                  onClick={() => handleSortRequest('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell style={{ color: user.status === 'Active' ? 'green' : 'orange' }}>{user.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(user)}>Edit</Button>
                  <Button color="error" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{form.id ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            error={errors.name}
            helperText={errors.name && 'Valid name is required'}
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            error={errors.email}
            helperText={errors.email && 'Valid email is required'}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel color={errors.role ? 'error' : 'primary'}>Role</InputLabel>
            <Select
              label="Role"
              error={errors.role}
              name="role"
              value={form.role}
              onChange={(e) => handleSelectChange(e, 'role')}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {errors.role && (
              <p style={{ color: 'red', fontSize: '13px', marginLeft: '15px' }}>
                Valid role is required
              </p>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              error={errors.status}
              name="status"
              value={form.status}
              onChange={(e) => handleSelectChange(e, 'status')}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
            {errors.status && (
              <p style={{ color: 'red', fontSize: '14px' }}>Valid status is required</p>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>{form.id ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersPage;
