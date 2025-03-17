import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Make sure this exists

export function useAuth() {
  return useContext(AuthContext);
}
