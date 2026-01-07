import React, { useState, useEffect } from "react";
import {
    createNotAvailability,
    getWorkerAvailability,
    CreateNotAvailabilityPayload,
    DailyAvailability,
} from "../services/api.service";

interface AvailabilityManagerProps {
    workerId: string;
}

const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({ workerId }) => {
    // Form state
    const [availabilityType, setAvailabilityType] = useState<"HOURLY" | "DAILY">("HOURLY");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [fromTime, setFromTime] = useState("09:00");
    const [toTime, setToTime] = useState("17:00");
    const [isNotAvailable, setIsNotAvailable] = useState(true);

    // Display state
    const [availability, setAvailability] = useState<DailyAvailability[]>([]);
    const [viewMonth, setViewMonth] = useState(new Date());
    
    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        loadAvailability();
    }, [workerId, viewMonth]);

    const loadAvailability = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Get first and last day of the month
            const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
            const lastDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);

            const startDate = formatDate(firstDay);
            const endDate = formatDate(lastDay);

            const response = await getWorkerAvailability(workerId, startDate, endDate);

            if (response.success) {
                setAvailability(response.availability);
            }
        } catch (err: any) {
            setError(err.message || "Failed to load availability");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!fromDate || !toDate) {
            setError("Please select both from and to dates");
            return;
        }

        if (availabilityType === "HOURLY" && (!fromTime || !toTime)) {
            setError("Please select both from and to times for hourly availability");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const payload: CreateNotAvailabilityPayload = {
                workerId,
                availabilityType,
                fromDate,
                toDate,
                fromTime: availabilityType === "HOURLY" ? fromTime : undefined,
                toTime: availabilityType === "HOURLY" ? toTime : undefined,
                isNotAvailable,
            };

            const response = await createNotAvailability(payload);

            if (response.success) {
                setSuccessMessage(
                    isNotAvailable
                        ? "Not available period set successfully"
                        : "Availability updated successfully"
                );
                
                // Reset form
                setFromDate("");
                setToDate("");
                setFromTime("09:00");
                setToTime("17:00");

                // Reload availability
                loadAvailability();

                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        } catch (err: any) {
            setError(err.message || "Failed to update availability");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const changeMonth = (offset: number) => {
        setViewMonth(
            new Date(viewMonth.getFullYear(), viewMonth.getMonth() + offset, 1)
        );
    };

    const getStatusColor = (status: string): string => {
        return status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
    };

    const monthName = viewMonth.toLocaleString("default", { month: "long", year: "numeric" });

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Manage Availability</h2>
                <p className="text-gray-600">Set your working hours and days off</p>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">{successMessage}</p>
                </div>
            )}

            {/* Set Availability Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Set Not Available Period
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Availability Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="HOURLY"
                                    checked={availabilityType === "HOURLY"}
                                    onChange={(e) => setAvailabilityType("HOURLY")}
                                    className="mr-2"
                                />
                                Specific Hours
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="DAILY"
                                    checked={availabilityType === "DAILY"}
                                    onChange={(e) => setAvailabilityType("DAILY")}
                                    className="mr-2"
                                />
                                Full Day
                            </label>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                From Date *
                            </label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                To Date *
                            </label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Time Range (only for HOURLY) */}
                    {availabilityType === "HOURLY" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From Time *
                                </label>
                                <input
                                    type="time"
                                    value={fromTime}
                                    onChange={(e) => setFromTime(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    To Time *
                                </label>
                                <input
                                    type="time"
                                    value={toTime}
                                    onChange={(e) => setToTime(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Status Toggle */}
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isNotAvailable}
                                onChange={(e) => setIsNotAvailable(e.target.checked)}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Mark as NOT available (leave unchecked to mark as available)
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Saving..." : "Save Availability"}
                    </button>
                </form>
            </div>

            {/* Calendar View */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        ← Previous
                    </button>
                    <h3 className="text-xl font-semibold text-gray-800">{monthName}</h3>
                    <button
                        onClick={() => changeMonth(1)}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        Next →
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading availability...</p>
                    </div>
                ) : availability.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availability.map((day) => (
                            <div
                                key={day.date}
                                className={`p-4 rounded-lg border-2 ${
                                    day.status === "Available"
                                        ? "border-green-200 bg-green-50"
                                        : "border-red-200 bg-red-50"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-gray-800">
                                        {new Date(day.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                                            day.status
                                        )}`}
                                    >
                                        {day.status}
                                    </span>
                                </div>
                                {day.slots.length > 0 && (
                                    <div className="space-y-1">
                                        {day.slots.map((slot, idx) => (
                                            <div
                                                key={idx}
                                                className="text-sm text-gray-600 bg-white/50 px-2 py-1 rounded"
                                            >
                                                {slot.fromTime} - {slot.toTime}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No availability data for this month
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvailabilityManager;