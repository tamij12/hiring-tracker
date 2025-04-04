const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const USERS_TABLE = process.env.NEXT_PUBLIC_AIRTABLE_USERS_TABLE;
const APPLICATIONS_TABLE = process.env.NEXT_PUBLIC_AIRTABLE_APPLICATIONS_TABLE;

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

//TODO:user with privdata
export async function getUsers() {
  try {
    const response = await fetch(`${AIRTABLE_API_URL}/${USERS_TABLE}`, {
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

    const usersWithApplications = await Promise.all(
      data.records.map(async (user) => {
        const applicationIds = user.fields["Related Applications"] || [];

        const applicationsPromises = applicationIds.map(async (appId) => {
          const appResponse = await fetch(
            `${AIRTABLE_API_URL}/${APPLICATIONS_TABLE}/${appId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );

          const appData = await appResponse.json();

          if (appData.records && appData.records.length > 0) {
            return appData.records[0];
          }
        });

        const applications = await Promise.all(applicationsPromises);

        return {
          ...user,
          relatedApplications: applications.filter((app) => app),
        };
      })
    );

    return usersWithApplications;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("No se pudieron obtener los usuarios. Intenta más tarde.");
  }
}
export async function createUser(user) {
  try {
    const response = await fetch(`${AIRTABLE_API_URL}/${USERS_TABLE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: user,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("No se pudo crear el usuario. Intenta más tarde.");
  }
}
