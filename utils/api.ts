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
  cost: number
  isFillToFull?: boolean
  missedFuelUp?: boolean
  notes?: string
  tags?: string
}) {
  const token = await getAuthToken()

  const formData = new FormData()
  formData.append("vehicleId", data.vehicleId)
  formData.append("date", new Date().toISOString()) // Send current date/time
  formData.append("odometer", data.mileage.toString())
  formData.append("fuelConsumed", data.gallons.toString()) // Correct field name
  formData.append("cost", data.cost.toString()) // Required by API
  formData.append("isFillToFull", (data.isFillToFull ?? true).toString()) // Default: true
  formData.append("missedFuelUp", (data.missedFuelUp ?? false).toString()) // Default: false

  if (data.notes) formData.append("notes", data.notes)
  if (data.tags) formData.append("tags", data.tags)

  const response = await fetch(`${process.env.LUBELOGGER_API_URL}/api/vehicle/gasrecords/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // Use form-data instead of JSON
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to submit fillup" }))
    throw new Error(error.message)
  }

  return response.json()
}
