"use client";
import { useState, useEffect } from "react";
import { getUsers } from "@/utils/airtable/users";

//TODO:
export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Usuarios Registrados</h1>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : users.length > 0 ? (
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="p-4 border border-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold">
                {user.fields["Full Name"]}
              </h2>
              <p className="text-gray-400">
                Correo: {user.fields["Email Address"]}
              </p>
              <p className="text-gray-500">Rol: {user.fields["Role"]}</p>

              <p className="mt-2 text-gray-400">Aplicaciones relacionadas:</p>
              <ul>
                {user.relatedApplications.length > 0 ? (
                  user.relatedApplications.map((app) => (
                    <li key={app.id}>
                      <p className="text-gray-400">
                        {app.fields["Candidate Name"]} -{" "}
                        {app.fields["Application Status"]}
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400">
                    No hay aplicaciones relacionadas
                  </p>
                )}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay usuarios registrados.</p>
      )}
    </div>
  );
}
