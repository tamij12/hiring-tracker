const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const JOB_OPENINGS_TABLE = process.env.NEXT_PUBLIC_AIRTABLE_JOB_OPENINGS_TABLE;

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

export async function getJobOpenings() {
  try {
    const response = await fetch(`${AIRTABLE_API_URL}/${JOB_OPENINGS_TABLE}`, {
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
    console.error("Error fetching job openings:", error);
    throw new Error(
      "No se pudieron obtener las ofertas de trabajo. Intenta más tarde."
    );
  }
}

export async function createJobOpening(jobOpening) {
  try {
    const response = await fetch(`${AIRTABLE_API_URL}/${JOB_OPENINGS_TABLE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          "Job Title": jobOpening["Job Title"],
          "Job Description": jobOpening["Job Description"],
          Requirements: jobOpening["Requirements"],
          "Job Type": jobOpening["Job Type"],
          "Salary Range":
            typeof jobOpening["Salary Range"] === "number"
              ? jobOpening["Salary Range"]
              : parseFloat(jobOpening["Salary Range"]),
        },
      }),
    });

    const data = await response.json();
    console.log(data, "DATA");

    if (!response.ok) {
      console.error("Error response:", data);
      throw new Error(`Error: ${response.statusText}`);
    }

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data;
  } catch (error) {
    console.error("Error creating job opening:", error);
    throw new Error(
      "No se pudo crear la oferta de trabajo. Intenta más tarde."
    );
  }
}

export async function updateJobOpening(id, jobOpening) {
  try {
    const response = await fetch(
      `${AIRTABLE_API_URL}/${JOB_OPENINGS_TABLE}/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Job Title": jobOpening["Job Title"],
            "Job Description": jobOpening["Job Description"],
            Requirements: jobOpening["Requirements"],
            "Job Type": jobOpening["Job Type"],
            "Salary Range": jobOpening["Salary Range"],
            "Posted Date": jobOpening["Posted Date"],
            "Related Applications": jobOpening["Related Applications"],
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data;
  } catch (error) {
    console.error("Error updating job opening:", error);
    throw new Error(
      "No se pudo actualizar la oferta de trabajo. Intenta más tarde."
    );
  }
}

export async function deleteJobOpening(id) {
  try {
    const response = await fetch(
      `${AIRTABLE_API_URL}/${JOB_OPENINGS_TABLE}/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data;
  } catch (error) {
    console.error("Error deleting job opening:", error);
    throw new Error(
      "No se pudo eliminar la oferta de trabajo. Intenta más tarde."
    );
  }
}
