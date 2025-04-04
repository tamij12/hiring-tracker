const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const APPLICATIONS_TABLE = process.env.NEXT_PUBLIC_AIRTABLE_APPLICATIONS_TABLE;

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

export async function getApplications() {
  try {
    const response = await fetch(`${AIRTABLE_API_URL}/${APPLICATIONS_TABLE}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.records;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw new Error(
      "No se pudieron obtener las aplicaciones. Intenta más tarde."
    );
  }
}

export async function createApplication(applicationData) {
  try {
    const response = await fetch(`${AIRTABLE_API_URL}/Applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          "Candidate Name": applicationData["Candidate Name"],
          "Email Address": applicationData["Email Address"],
          "Application Status": applicationData["Application Status"],
          "Phone Number": applicationData["Phone Number"],
          "Job Opening": [applicationData["Job Opening"]],
          Resume: [
            {
              url: applicationData.Resume,
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${data.error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error al crear la aplicación:", error);
    throw new Error("Hubo un problema al crear la aplicación.");
  }
}

export async function updateApplication(applicationId, applicationData) {
  try {
    const response = await fetch(
      `${AIRTABLE_API_URL}/Applications/${applicationId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Candidate Name": applicationData["Candidate Name"],
            "Email Address": applicationData["Email Address"],
            "Phone Number": applicationData["Phone Number"],
            Resume: [
              {
                url: applicationData.Resume,
              },
            ],
            "Job Opening": [applicationData["Job Opening"]],
            "Application Status": applicationData["Application Status"],
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${data.error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error al actualizar la aplicación:", error);
    throw new Error("Hubo un problema al actualizar la aplicación.");
  }
}

export async function deleteApplication(id) {
  try {
    const response = await fetch(
      `${AIRTABLE_API_URL}/${APPLICATIONS_TABLE}/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar la aplicación");
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar la aplicación:", error);
    throw error;
  }
}
