import { API_URL } from "./roleService";
export const fetchUsers = async () => {
    const response = await fetch('http://localhost:3001/users');
    return response.json();
  };
  
/**
 * Create a new user.
 * @param user The user data to be created.
 * @returns {Promise<any>} A promise that resolves to the created user.
 */
export const createUser = async (user: any): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };
  
  /**
   * Update an existing user.
   * @param user The updated user data.
   * @returns {Promise<any>} A promise that resolves to the updated user.
   */
  export const updateUser = async (user: any): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };
  
  /**
   * Delete a user by ID.
   * @param userId The ID of the user to be deleted.
   * @returns {Promise<void>} A promise that resolves when the user is deleted.
   */
  export const deleteUser = async (userId: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };