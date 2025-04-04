# 🧩 Hiring Tracker

Aplicación desarrollada en **Next.js + Tailwind CSS** conectada a **Airtable** para gestionar ofertas, aplicaciones y aplicados. También permite subir archivos como CVs o imágenes mediante **UploadThing**.

---

## 🚀 Tecnologías utilizadas

- Next.js (App Router)
- Tailwind CSS
- Airtable API
- UploadThing
- JavaScript

---

## 🔧 Configuración del proyecto

### 1. Clonar el repositorio

````bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo


---

## ⚙️ Configuración del entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```bash
# Airtable
AIRTABLE_API_KEY=tu_api_key_de_airtable
AIRTABLE_BASE_ID=tu_base_id
AIRTABLE_TABLE_APPLICATIONS=Applications
AIRTABLE_TABLE_JOB_OPENINGS=Job Openings
AIRTABLE_TABLE_USERS=Users

# UploadThing
UPLOADTHING_TOKEN=tu_uploadthing_token

Asegúrate de reemplazar tu_api_key_de_airtable y tu_base_id_de_airtable con los valores correspondientes de tu cuenta de Airtable.

Usar la configuración en el frontend:

En tus componentes o páginas donde necesites acceder a Airtable, puedes importar las funciones getJobOpenings y getApplications desde utils/airtable/ para obtener los datos de las ofertas de trabajo y las aplicaciones relacionadas.


const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const JOB_OPENINGS_TABLE = process.env.NEXT_PUBLIC_AIRTABLE_JOB_OPENINGS_TABLE;
const APPLICATIONS_TABLE = process.env.NEXT_PUBLIC_AIRTABLE_APPLICATIONS_TABLE;

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

// Función para obtener todas las ofertas de trabajo
export const getJobOpenings = async () => {
  try {
    const response = await fetch(`${AIRTABLE_API_URL}/${JOB_OPENINGS_TABLE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.records;
  } catch (error) {
    console.error('Error al obtener ofertas de trabajo', error);
    throw error;
  }
};

Conexión con UploadThing

Para la carga de archivos, configuramos UploadThing en api/uploadthing



🧑‍💻 Hecho por
Tania Mijangos — GitHub
````
