"use client";
import { useState, useEffect } from "react";
import {
  getApplications,
  createApplication,
  deleteApplication,
  updateApplication,
} from "@/utils/airtable/applications";
import Image from "next/image";
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { getJobOpenings } from "@/utils/airtable/jobOpenings";
import Navbar from "../NavBar";

export default function ApplicationsList() {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    "Candidate Name": "",
    "Email Address": "",
    "Phone Number": "",
    Resume: "",
    "Job Title": "",
    "Application Status": "Submitted",
  });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsData, jobOpeningsData] = await Promise.all([
          getApplications(),
          getJobOpenings(),
        ]);

        setApplications(applicationsData);
        setJobOpenings(jobOpeningsData);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadComplete = (url) => {
    setFormData((prev) => ({
      ...prev,
      Resume: url,
    }));
  };

  const handleDelete = async (id) => {
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      alert("✅ Aplicación eliminada exitosamente");
    } catch (error) {
      console.error("No se pudo eliminar:", error);
      alert("❌ Hubo un error al eliminar la aplicación");
    }
  };

  const handleEdit = (application) => {
    setFormData({
      "Candidate Name": application.fields["Candidate Name"] || "",
      "Email Address": application.fields["Email Address"] || "",
      "Phone Number": application.fields["Phone Number"] || "",
      Resume: application.fields["Resume"]?.[0]?.url || "",
      "Job Opening": application.fields["Job Opening"]?.[0] || "",
      "Application Status":
        application.fields["Application Status"] || "Submitted",
    });
    setEditingId(application.id);
    setIsCreating(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const updatedApplication = await updateApplication(editingId, formData);
        setApplications((prevApplications) =>
          prevApplications.map((application) =>
            application.id === editingId ? updatedApplication : application
          )
        );
        setMessage("Aplicación actualizada exitosamente!");
      } else {
        const newApplication = await createApplication(formData);
        setApplications((prevApplications) => [
          ...prevApplications,
          newApplication,
        ]);
        setMessage("Aplicación creada exitosamente!");
      }

      setFormData({
        "Candidate Name": "",
        "Email Address": "",
        "Phone Number": "",
        Resume: "",
        "Job Opening": "",
        "Application Status": "Submitted",
      });

      setEditingId(null);
      setIsCreating(false);
    } catch (error) {
      console.error("Error al crear/actualizar la aplicación:", error);
      setMessage("Hubo un problema al crear/actualizar la aplicación.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Aplicaciones Recibidas</h1>

      {/* Botón para alternar el formulario */}
      <button
        onClick={() => setIsCreating((prev) => !prev)}
        className="mb-4 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg"
      >
        {isCreating ? "Cancel" : "Add Application"}
      </button>

      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-md mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">Crear Nueva Aplicación</h2>
          <div className="mb-4">
            <label
              htmlFor="candidateName"
              className="block text-sm font-medium"
            >
              Nombre del Candidato
            </label>
            <input
              type="text"
              id="candidateName"
              name="Candidate Name"
              value={formData["Candidate Name"]}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="Email Address"
              value={formData["Email Address"]}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium">
              Phone Number
            </label>
            <input
              type="number"
              id="phoneNumber"
              name="Phone Number"
              value={formData["Phone Number"]}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="jobOpening" className="block text-sm font-medium">
              Título del trabajo
            </label>
            <select
              id="jobOpening"
              name="Job Opening"
              value={formData["Job Opening"]}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
              required
            >
              <option value="">Selecciona un trabajo</option>
              {jobOpenings.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.fields["Job Title"] || "Sin título"}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">
              Currículum (PDF o imagen)
            </label>
            <UploadButton
              endpoint="resumeUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  handleUploadComplete(res[0].url);
                }
              }}
              onUploadError={(error) => {
                alert(`Error al subir: ${error.message}`);
              }}
            />
            {formData.Resume && (
              <p className="mt-2 text-green-400 text-sm break-all">
                Archivo subido: {formData.Resume}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium">
              Estado de la Aplicación
            </label>
            <select
              id="status"
              name="Application Status"
              value={formData["Application Status"]}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
              required
            >
              <option value="Submitted">Submitted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Under Review">Under Review </option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg"
          >
            {editingId ? "Edit" : "Create"}
          </button>

          {message && <p className="mt-4 text-lg text-green-500">{message}</p>}
        </form>
      )}

      {loading ? (
        <p>Cargando aplicaciones...</p>
      ) : applications.length > 0 ? (
        <ul className="space-y-4">
          {applications.map((application) => {
            const resume = application.fields["Resume"];
            const resumeUrl =
              typeof resume === "string"
                ? resume
                : Array.isArray(resume) && resume.length > 0
                ? resume[0].url
                : null;

            return (
              <li
                key={application.id}
                className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-2xl transition-shadow flex gap-6 items-center"
              >
                {/* Vista previa del archivo (CV) */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                  {resumeUrl ? (
                    !resumeUrl.endsWith(".pdf") ? (
                      <Image
                        src={resumeUrl}
                        alt="CV Preview"
                        width={100}
                        height={130}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <p className="text-gray-400 text-center text-sm px-2">
                        PDF no visible
                      </p>
                    )
                  ) : (
                    <p className="text-gray-400 text-center text-sm px-2">
                      Sin resume
                    </p>
                  )}
                </div>

                {/* Datos del candidato */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-blue-400 mb-2">
                    Candidate: {application.fields["Candidate Name"]}
                  </h2>
                  <p className="text-lg text-gray-300">
                    <span className="font-semibold text-blue-400">Email:</span>{" "}
                    {application.fields["Email Address"]}
                  </p>
                  <p className="text-lg text-gray-300">
                    <span className="font-semibold text-blue-400">Phone:</span>{" "}
                    {application.fields["Phone Number"] || "No disponible"}
                  </p>
                  <p className="text-lg text-gray-300">
                    <span className="font-semibold text-blue-400">
                      Applied for:
                    </span>{" "}
                    {application.fields["Job Title"]}
                  </p>
                  <p className="text-lg text-gray-300">
                    <span className="font-semibold text-blue-400">Status:</span>{" "}
                    {application.fields["Application Status"]}
                  </p>

                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      onClick={() => handleEdit(application)}
                      className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(application.id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No hay aplicaciones aún.</p>
      )}
    </div>
  );
}
