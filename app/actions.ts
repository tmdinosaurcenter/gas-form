"use server"

import { fetchVehicles, submitFillup } from "@/utils/api"

export async function getVehicles() {
  try {
    return await fetchVehicles()
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    throw new Error("Failed to fetch vehicles")
  }
}

export async function submitGasFillup(data: {
  name: string
  vehicleId: string
  mileage: number
  gallons: number
}) {
  try {
    return await submitFillup(data)
  } catch (error) {
    console.error("Error submitting fillup:", error)
    throw new Error("Failed to submit gas fillup")
  }
}

