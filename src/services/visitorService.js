const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://visitorx.onrender.com";

export async function getAllVisitors() {
  const response = await fetch(`${BASE_URL}/api/admin/all`);

  if (!response.ok) {
    throw new Error("Failed to fetch visitor data");
  }

  return await response.json();
}

export async function registerVisitor(visitorData) {
  const payload = {
    name: visitorData.name,
    mobileNumber: visitorData.phone,
    email: visitorData.email,
    address: visitorData.address || "Not Provided",
    purposeOfVisit: visitorData.purpose,
    photoUrl: visitorData.photo || "",
  };

  const response = await fetch(`${BASE_URL}/api/visitor/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to register visitor");
  }

  return await response.json();
}

export async function getVisitorById(id) {
  const response = await fetch(`${BASE_URL}/api/visitor/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch visitor");
  }

  return await response.json();
}

export async function updateVisitorPhoto(id, photoData) {
  const response = await fetch(`${BASE_URL}/api/visitor/${id}/photo`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      photoUrl: photoData,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update photo: ${response.status}`);
  }

  return await response.json();
}