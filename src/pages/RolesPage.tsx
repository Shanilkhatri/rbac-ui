import React, { useEffect, useState } from 'react';
import { fetchRoles, fetchPermissions, updateRole, createRole } from '../services/roleService';
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
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  InputAdornment,
  IconButton,
  TableSortLabel,
  InputLabel,
  FormControl
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export type Permission = {
  id: number;
  name: string;
};

type RoleForm = {
  id?: number | null;
  name: string;
  permissions: number[];
};

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<RoleForm>({
    id: null,
    name: '',
    permissions: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<'name' | 'permissions'>('name');
  const [filteredRoles, setFilteredRoles] = useState<any[]>([]);
  const [errors, setErrors] = useState({ name: false, permissions: false });

  // Fetch roles and permissions on load
  useEffect(() => {
    fetchRoles().then((data) => setRoles(data));
    fetchPermissions().then((data) => setPermissions(data));
  }, []);

  // Handling search
  useEffect(() => {
    setFilteredRoles(
      roles.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, roles]);

  // Sorting function
  const handleSort = (field: 'name' | 'permissions') => {
    const newSortDirection =
      orderBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setOrderBy(field);
    setSortDirection(newSortDirection);

    const sortedRoles = [...filteredRoles].sort((a, b) => {
      if (field === 'name') {
        return newSortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        const aPermsCount = a.permissions.length;
        const bPermsCount = b.permissions.length;
        return newSortDirection === 'asc' ? aPermsCount - bPermsCount : bPermsCount - aPermsCount;
      }
    });
    setFilteredRoles(sortedRoles);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (event: any) => {
    setForm({ ...form, permissions: event.target.value });
  };

  const handleOpen = (role: any = { id: null, name: '', permissions: [] }) => {
    setErrors({ name: false, permissions: false });
    setForm(role);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    const validationErrors: any = {
        name: form.name.trim() === '' || !/^[A-Za-z]+([ '-][A-Za-z]+)*$/.test(form.name),
        permissions: form.permissions.length === 0,
    };
  
    setErrors(validationErrors);
  
    if (Object.values(validationErrors).includes(true)) {
    return; // If there are validation errors, don't proceed
    }
    if (form.id) {
      await updateRole(form)
    } else {
      // Create new role
      // create random id
      let newRole = {
        ...form,
        id: `${Math.floor(Math.random() * 1000000)}`
      }
      await createRole(newRole)
    }
    fetchRoles().then((data) => setRoles(data));
    handleClose();
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3001/roles/${id}`, {
      method: 'DELETE',
    });
    fetchRoles().then((data) => setRoles(data));
  };

  return (
    <div>
      <h1>Roles Management</h1>

      {/* Search Input */}
      <TextField
        label="Search Roles"
        value={searchTerm}
        placeholder="Search by name"
        onChange={(e) => setSearchTerm(e.target.value)}
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        fullWidth
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Role
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
            <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
            >
                Role
                </TableSortLabel>
            </TableCell>
            <TableCell>
            <TableSortLabel
                  active={orderBy === 'permissions'}
                  direction={orderBy === 'permissions' ? sortDirection : 'asc'}
                  onClick={() => handleSort('permissions')}
            >
                Permissions 
              </TableSortLabel>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRoles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                {role.permissions
                    .map((permId: number) =>
                    permissions.find(perm => perm.id === permId)?.name
                    )
                    .filter((name:any) => name !== undefined) // Remove undefined values
                    .join(', ')}
            </TableCell>
              <TableCell>
                <Button onClick={() => handleOpen(role)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(role.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{form.id ? 'Edit Role' : 'Add Role'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            error={errors.name}
            helperText={errors.name ? 'Role Name is required' : ''}
          />
          <FormControl fullWidth margin="normal">
          <InputLabel color={errors.permissions ? 'error' : 'primary'}>
            Permissions
          </InputLabel>
            <Select
                label="Permissions"
                name="permissions"
                error={errors.permissions}
                multiple
                value={form.permissions}
                onChange={handlePermissionChange}
                renderValue={(selected: any) =>
                selected
                    .map((permId: number) =>
                    permissions.find((perm) => perm.id === permId)?.name
                    ).filter((name:any) => name !== undefined)
                    .join(', ')
                }
                fullWidth
            >
                {permissions.map((permission) => (
                <MenuItem key={permission.id} value={permission.id}>
                    <Checkbox checked={form.permissions.includes(permission.id)} />
                    <ListItemText primary={permission.name} />
                </MenuItem>
                ))}
            </Select>
            {errors.permissions && <p style={{ color: 'red', fontSize: '13px', marginLeft: '10px' }}>At least one permission is required</p>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RolesPage;
