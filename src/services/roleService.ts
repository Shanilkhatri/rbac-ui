import { Permission } from "../pages/RolesPage";

export const API_URL = 'http://localhost:3001';

/**
 * Fetch all roles from the API.
 * @returns {Promise<any[]>} A promise that resolves to the list of roles.
 */
export const fetchRoles = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/roles`);
    if (!response.ok) {
      throw new Error('Failed to fetch roles');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

/**
 * Fetch all permissions from the API.
 * @returns {Promise<any[]>} A promise that resolves to the list of permissions.
 */
export const fetchPermissions = async (): Promise<Permission[]> => {
  try {
    const response = await fetch(`${API_URL}/permissions`);
    if (!response.ok) {
      throw new Error('Failed to fetch permissions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return [];
  }
};

/**
 * Create a new role.
 * @param role The role data to be created.
 * @returns {Promise<any>} A promise that resolves to the created role.
 */
export const createRole = async (role: any): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role),
    });
    if (!response.ok) {
      throw new Error('Failed to create role');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

/**
 * Update an existing role.
 * @param role The updated role data.
 * @returns {Promise<any>} A promise that resolves to the updated role.
 */
export const updateRole = async (role: any): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/roles/${role.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role),
    });
    if (!response.ok) {
      throw new Error('Failed to update role');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

/**
 * Delete a role by ID.
 * @param roleId The ID of the role to be deleted.
 * @returns {Promise<void>} A promise that resolves when the role is deleted.
 */
export const deleteRole = async (roleId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/roles/${roleId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete role');
    }
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

export const createPermission = async (permission: { name: string }): Promise<void> => {
    console.log(permission);
    await fetch(`${API_URL}/permissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(permission),
    });
  };
  
  export const updatePermission = async (id: number, permission: { name: string }): Promise<void> => {
    await fetch(`${API_URL}/permissions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(permission),
    });
  };
  
  export const deletePermission = async (id: number): Promise<void> => {
    await fetch(`${API_URL}/permissions/${id}`, {
      method: 'DELETE',
    });
  };
  