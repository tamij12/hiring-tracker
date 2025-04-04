"use client";
import { useState, useEffect } from "react";
import {
  getJobOpenings,
  createJobOpening,
  updateJobOpening,
  deleteJobOpening,
  getApplicationsByIds,
} from "@/utils/airtable/jobOpenings";
import Image from "next/image";
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import Navbar from "../NavBar";

export default function JobOpeningsList() {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    "Job Title": "",
    "Job Description": "",
    Requirements: "",
    "Salary Range": "",
    "Job Type": "Full-time",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [applications, setApplications] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobOpeningsData = await getJobOpenings();
        setJobOpenings(jobOpeningsData);
        setJobOpenings(jobOpeningsData);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar las ofertas de trabajo:", error);
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

  const handleEditClick = (job) => {
    setFormData({
      "Job Title": job.fields["Job Title"] || "",
      "Job Description": job.fields["Job Description"] || "",
      Requirements: job.fields["Requirements"] || "",
      "Salary Range": job.fields["Salary Range"] || "",
      "Job Type": job.fields["Job Type"] || "",
    });
    setEditingId(job.id);
    setIsCreating(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteJobOpening(id);
      setJobOpenings((prev) => prev.filter((job) => job.id !== id));
      alert("✅ Oferta eliminada exitosamente");
    } catch (error) {
      console.error("No se pudo eliminar:", error);
      alert("❌ Hubo un error al eliminar la oferta");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updatedJob = await updateJobOpening(editingId, formData);
        setJobOpenings((prevJobOpenings) =>
          prevJobOpenings.map((job) =>
            job.id === editingId ? updatedJob : job
          )
        );
        setMessage("Oferta de trabajo actualizada exitosamente!");
      } else {
        const newJob = await createJobOpening(formData);
        setJobOpenings((prevJobOpenings) => [...prevJobOpenings, newJob]);
        setMessage("Oferta de trabajo creada exitosamente!");
      }

      setFormData({
        "Job Title": "",
        "Job Description": "",
        Requirements: "",
        "Salary Range": "",
        "Job Type": "Full-time",
      });

      setEditingId(null);
      setIsCreating(false);
    } catch (error) {
      console.error("Error al crear/actualizar la oferta de trabajo:", error);
      setMessage("Hubo un problema al crear/actualizar la oferta.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Ofertas de Trabajo</h1>

      <button
        onClick={() => setIsCreating((prev) => !prev)}
        className="mb-4 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg"
      >
        {isCreating ? "Cancelar" : "Añadir Oferta"}
      </button>

      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-md mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Editar Oferta" : "Crear Nueva Oferta"}
          </h2>
          <div className="mb-4">
            <label htmlFor="jobTitle" className="block text-sm font-medium">
              Título del Trabajo
            </label>
            <input
              type="text"
              id="jobTitle"
              name="Job Title"
              value={formData["Job Title"]}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="jobDescription"
              className="block text-sm font-medium"
            >
              Descripción del Trabajo
            </label>
            <textarea
              id="jobDescription"
              name="Job Description"
              value={formData["Job Description"]}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="requirements" className="block text-sm font-medium">
              Requisitos
            </label>
            <textarea
              id="requirements"
              name="Requirements"
              value={formData["Requirements"]}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="salaryRange" className="block text-sm font-medium">
              Rango Salarial
            </label>
            <input
              type="text"
              id="salaryRange"
              name="Salary Range"
              value={formData["Salary Range"]}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="jobType" className="block text-sm font-medium">
              Tipo de Trabajo
            </label>
            <select
              id="jobType"
              name="Job Type"
              value={formData["Job Type"]}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
              required
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg"
          >
            {editingId ? "Editar" : "Crear"}
          </button>
        </form>
      )}

      {loading ? (
        <p>Cargando ofertas...</p>
      ) : jobOpenings.length > 0 ? (
        <ul className="space-y-4">
          {jobOpenings.map((job) => (
            <li
              key={job.id}
              className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
            >
              <h3 className="text-4xl font-semibold text-blue-400">
                {job.fields["Job Title"]}
              </h3>
              <p className="text-lg text-gray-300">
                <span className="font-semibold text-blue-400">
                  Description:
                </span>{" "}
                {job.fields["Job Description"]}
              </p>
              <p className="text-lg text-gray-300">
                <span className="font-semibold text-blue-400">
                  Requirements:
                </span>{" "}
                {job.fields["Requirements"]}
              </p>
              <p className="text-lg text-gray-300">
                <span className="font-semibold text-blue-400">
                  Salary Range: $
                </span>{" "}
                {job.fields["Salary Range"]}
              </p>
              <p className="text-lg text-gray-300">
                <span className="font-semibold text-blue-400">Job Type:</span>{" "}
                {job.fields["Job Type"]}
              </p>
              <p className="text-lg text-gray-300"></p>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => handleEditClick(job)}
                  className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay ofertas de trabajo.</p>
      )}
    </div>
  );
}
