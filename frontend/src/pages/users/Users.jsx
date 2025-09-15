import { useEffect, useState } from "react";
import { getUsers } from "../../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      <ul>
        {users.map(u => (
          <li key={u.UUID}>
            {u.first_name} {u.last_name} ({u.user_role})
          </li>
        ))}
      </ul>
    </div>
  );
}
