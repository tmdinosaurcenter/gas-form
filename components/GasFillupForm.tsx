"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getVehicles, submitGasFillup } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FuelIcon as GasPump, Trash2 } from "lucide-react"

interface Vehicle {
  id: string
  name: string
}

export default function GasFillupForm() {
  const { toast } = useToast()

  // Form state variables
  const [vehicle, setVehicle] = useState("")
  const [mileage, setMileage] = useState("")
  const [fuelAmount, setFuelAmount] = useState("")
  const [fuelCost, setFuelCost] = useState("")
  const [fuelReceipt, setFuelReceipt] = useState<File | null>(null) // Image file state
  const [previewURL, setPreviewURL] = useState<string | null>(null) // Image preview state

  // API-related state
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch vehicles from API when the component loads
  useEffect(() => {
    async function loadVehicles() {
      setIsLoading(true)
      try {
        const vehicleData = await getVehicles()
        setVehicles(vehicleData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load vehicles. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadVehicles()
  }, [toast])

  // Allowed image formats for uploads (common phone formats)
  const allowedFormats = ["image/png", "image/jpeg", "image/jpg", "image/heic", "image/heif", "image/webp"]

  // Handle file selection and validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file && !allowedFormats.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (PNG, JPG, JPEG, HEIC, or WebP).",
        variant: "destructive",
      })
      setFuelReceipt(null) // Reset file selection
      setPreviewURL(null)
      return
    }

    setFuelReceipt(file)

    // Create an object URL for preview
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewURL(url)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await submitGasFillup({
        vehicleId: vehicle,
        mileage: Number(mileage),
        gallons: Number(fuelAmount),
        cost: Number(fuelCost),
        isFillToFull: true,
        missedFuelUp: false,
        file: fuelReceipt, // Attach uploaded file
      })

      toast({
        title: "Success",
        description: "Gas fillup has been recorded successfully.",
      })

      // Reset form state after successful submission
      setVehicle("")
      setMileage("")
      setFuelAmount("")
      setFuelCost("")
      setFuelReceipt(null)
      setPreviewURL(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit gas fillup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="max-w-md mx-auto border-primary shadow-lg">
        {/* Form Header */}
        <CardHeader className="space-y-1 text-center bg-primary text-white rounded-t-lg">
          <div className="flex justify-center mb-2">
            <GasPump size={32} />
          </div>
          <CardTitle className="text-2xl font-vollkorn">Gas Fill-up Form</CardTitle>
        </CardHeader>

        {/* Form Content */}
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Selection */}
            <div className="space-y-2">
              <Label htmlFor="vehicle" className="text-mdc-dark">Vehicle</Label>
              <Select value={vehicle} onValueChange={setVehicle} disabled={isLoading || isSubmitting}>
                <SelectTrigger id="vehicle" className="border-mdc-blue focus:ring-secondary">
                  <SelectValue placeholder={isLoading ? "Loading vehicles..." : "Select a vehicle"} />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mileage Input */}
            <div className="space-y-2">
              <Label htmlFor="mileage" className="text-mdc-dark">Vehicle Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                required
                min="0"
                step="1"
                className="border-mdc-blue focus:ring-secondary"
                disabled={isSubmitting}
              />
            </div>

            {/* Fuel Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="fuelAmount" className="text-mdc-dark">Fuel Amount (Gallons)</Label>
              <Input
                id="fuelAmount"
                type="number"
                value={fuelAmount}
                onChange={(e) => setFuelAmount(e.target.value)}
                required
                min="0"
                step="0.001"
                className="border-mdc-blue focus:ring-secondary"
                disabled={isSubmitting}
              />
            </div>

            {/* Fuel Cost Input */}
            <div className="space-y-2">
              <Label htmlFor="fuelCost" className="text-mdc-dark">Fuel Cost ($)</Label>
              <Input
                id="fuelCost"
                type="number"
                value={fuelCost}
                onChange={(e) => setFuelCost(e.target.value)}
                required
                min="0"
                step="0.01"
                className="border-mdc-blue focus:ring-secondary"
                disabled={isSubmitting}
              />
            </div>

            {/* File Upload Input */}
            <div className="space-y-2">
              <Label htmlFor="fuelReceipt" className="text-mdc-dark">Upload Receipt (Optional)</Label>
              <Input
                id="fuelReceipt"
                type="file"
                accept=".png, .jpg, .jpeg, .heic, .heif, .webp"
                onChange={handleFileChange}
                className="border-mdc-blue focus:ring-secondary"
                disabled={isSubmitting}
              />
              {/* Show image preview if a file is selected */}
              {previewURL && (
                <div className="relative mt-2">
                  <img src={previewURL} alt="Receipt preview" className="w-full max-h-40 object-contain rounded-md" />
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-white bg-red-600 p-1 rounded-full"
                    onClick={() => { setFuelReceipt(null); setPreviewURL(null) }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-primary hover:bg-secondary text-mdc-dark font-semibold transition-colors" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
