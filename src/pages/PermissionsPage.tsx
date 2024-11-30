import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TableSortLabel,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchPermissions, createPermission, updatePermission, deletePermission } from '../services/roleService';

type Permission = {
  id: number;
  name: string;
};

const PermissionsPage: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([]);
  const [open, setOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null);
  const [newPermissionName, setNewPermissionName] = useState('');
  const [errors, setErrors] = useState({ name: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');

  // Fetch permissions on load
  useEffect(() => {
    loadPermissions();
  }, []);

  useEffect(() => {
    filterPermissions(searchTerm);
  }, [permissions, searchTerm]);

  const loadPermissions = async () => {
    const data = await fetchPermissions();
    setPermissions(data);
    setFilteredPermissions(data); // Set filtered permissions initially to all
  };

  const filterPermissions = (search: string) => {
    const filtered = permissions.filter(permission =>
      permission.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPermissions(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOpen = (permission?: Permission) => {
    setErrors({ name: false });
    setCurrentPermission(permission || null);
    setNewPermissionName(permission?.name || '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentPermission(null);
    setNewPermissionName('');
  };

  const handleSave = async () => {
    const validationErrors: any = {
      name: newPermissionName.trim() === '' || !/^[A-Za-z]+([ '-][A-Za-z]+)*$/.test(newPermissionName),
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).includes(true)) {
      return;
    }
    if (currentPermission) {
      // Update existing permission
      await updatePermission(currentPermission.id, { name: newPermissionName });
    } else {
      // Create new permission
      await createPermission({ name: newPermissionName });
    }
    loadPermissions();
    handleClose();
  };

  const handleDelete = async (id: number) => {
    await deletePermission(id);
    loadPermissions();
  };

  const handleSortRequest = (property: string) => {
    const isAsc = orderBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedPermissions = filteredPermissions.sort((a, b) => {
    const isAsc = sortDirection === 'asc';
    if (orderBy === 'name') {
      return isAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    return 0; // Add other sorting properties if needed
  });

  return (
    <div>
      <h1>Permissions Management</h1>
      
      {/* Search */}
      <div>
        <TextField
          label="Search Permissions"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name"
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
        Add Permission
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPermissions.map(permission => (
              <TableRow key={permission.id}>
                <TableCell>{permission.name}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(permission)}>Edit</Button>
                  <Button color="error" onClick={() => handleDelete(permission.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      {/* Dialog for Adding/Editing Permission */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentPermission ? 'Edit Permission' : 'Add Permission'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Permission Name"
            fullWidth
            value={newPermissionName}
            onChange={(e) => setNewPermissionName(e.target.value)}
            error={errors.name}
            helperText={errors.name ? 'Valid permission name is required' : ''}
          />
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

export default PermissionsPage;
