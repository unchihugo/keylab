import { useEffect, useState } from "react";
import { userService } from "../services/userService";

const { getUserRole, setUserRole } = userService;

import { User } from "../types/user";

export function useUsers(userId: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        
        const data = await getUserRole(userId);
        setUser(data);
      } catch (err) {
        setError("Failed to load user.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [userId]);

  async function changeUserRole(roleId: number) {
    if (!user) return;
    try {
      const updatedUser = await setUserRole(user.id, roleId);
      setUser(updatedUser); // Update the state with new role
    } catch {
      setError("Failed to update role.");
    }
  }

  return { user, loading, error, changeUserRole };
}
