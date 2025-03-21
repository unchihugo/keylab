// In src/hooks/useAuth.ts
import { useState, useEffect } from "react";

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check if the user is an admin
    // This is a placeholder - replace with your actual authentication logic
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const userData = await response.json();
        setIsAdmin(userData.roleId === 2); // Assuming roleId 2 is admin
      } catch (error) {
        console.error("Failed to check admin status", error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  return { isAdmin };
}