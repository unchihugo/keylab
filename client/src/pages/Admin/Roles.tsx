import { useState, useEffect } from "react";
import { updateUserRole } from "../../services/userService";
import { User } from "../../types/user";
import { useAuth } from "../../hooks/useAuth"; // Assuming you have an auth hook
import { useNavigate } from "react-router-dom";

const RolesPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth(); // Check if user is admin
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/"); // Redirect non-admins to home
    }
    
    async function fetchUsers() {
      try {
        // Assuming you have an API endpoint to fetch all users
        const response = await fetch("/api/users"); 
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [isAdmin, navigate]);

  async function handleRoleChange(userId: number, roleId: number) {
    try {
      await updateUserRole(userId, roleId);
      setUsers(users.map((user) => user.id === userId ? { ...user, roleId } : user));
      alert("Role updated successfully!");
    } catch (error) {
      console.error("Failed to update role", error);
    }
  }

  if (loading) return <p>Loading users...</p>;
  if (!isAdmin) return <p>Access Denied</p>;

  return (
    <div>
      <h1>Manage User Roles</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.forename} {user.surname}</td>
              <td>{user.email}</td>
              <td>{user.roleId === 1 ? "User" : "Admin"}</td>
              <td>
                <select
                  value={user.roleId}
                  onChange={(e) => handleRoleChange(user.id, Number(e.target.value))}
                >
                  <option value="1">User</option>
                  <option value="2">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolesPage;
