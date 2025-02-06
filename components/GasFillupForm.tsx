"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getVehicles, submitGasFillup } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FuelIcon as GasPump } from "lucide-react"

interface Vehicle {
  id: string
  name: string
}

export default function GasFillupForm() {
  const { toast } = useToast()
  const [vehicle, setVehicle] = useState("")
  const [mileage, setMileage] = useState("")
  const [fuelAmount, setFuelAmount] = useState("")
  const [fuelCost, setFuelCost] = useState("")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      })

      toast({
        title: "Success",
        description: "Gas fillup has been recorded successfully.",
      })

      // Reset form
      setVehicle("")
      setMileage("")
      setFuelAmount("")
      setFuelCost("")
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
        <CardHeader className="space-y-1 text-center bg-primary text-white rounded-t-lg">
          <div className="flex justify-center mb-2">
            <GasPump size={32} />
          </div>
          <CardTitle className="text-2xl font-vollkorn">Gas Fill-up Form</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Mileage, Fuel, Cost Inputs */}
            
            <Button type="submit" className="w-full bg-primary hover:bg-secondary text-mdc-dark font-semibold transition-colors" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
