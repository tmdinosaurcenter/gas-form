"use server"

let authToken: string | null = null
let tokenExpiry: number | null = null

async function getAuthToken() {
  // Check if we have a valid token
  if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
    return authToken
  }

  // Get new token
  try {
    const response = await fetch(`${process.env.LUBELOGGER_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: process.env.LUBELOGGER_USERNAME,
        password: process.env.LUBELOGGER_PASSWORD,
      }),
    })

    if (!response.ok) {
      throw new Error("Authentication failed")
    }

    const data = await response.json()
    authToken = data.token
    // Set token expiry to 1 hour from now
    tokenExpiry = Date.now() + 60 * 60 * 1000
    return authToken
  } catch (error) {
    console.error("Authentication error:", error)
    throw new Error("Failed to authenticate with LubeLogger API")
  }
}

export async function fetchVehicles() {
  const token = await getAuthToken()

  const response = await fetch(`${process.env.LUBELOGGER_API_URL}/api/vehicles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch vehicles")
  }

  return response.json()
}

export async function submitFillup(data: {
  name: string
  vehicleId: string
  mileage: number
  gallons: number
}) {
  const token = await getAuthToken()

  const response = await fetch(`${process.env.LUBELOGGER_API_URL}/api/fillups`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employee: data.name,
      vehicle_id: data.vehicleId,
      odometer: data.mileage,
      gallons: data.gallons,
      date: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to submit fillup" }))
    throw new Error(error.message)
  }

  return response.json()
}

