import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft } from "lucide-react";

import {
    getAutomotiveById,
    AutomotiveService,
} from "../services/AutomotiveServcie.service";
import Button from "../components/ui/Buttons";
import typography, { combineTypography } from "../styles/typography";

const AutomotiveDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [data, setData] = useState<AutomotiveService | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            try {
                const res = await getAutomotiveById(id);
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return <p className="p-6 text-center">Loading...</p>;
    }

    if (!data) {
        return <p className="p-6 text-center text-red-600">No data found</p>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Back */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
            >
                <ArrowLeft size={16} />
                Back
            </Button>

            {/* Image + Details Card */}
            <div className="flex flex-col md:flex-row gap-6 p-4 sm:p-6 rounded-2xl border border-gray-200 transition-all duration-300 hover:border-blue-500 hover:shadow-lg cursor-pointer">
                {/* Image */}
                <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${data.images?.[0]}`}
                    alt={data.name}
                    className="w-full md:w-96 h-64 object-cover rounded-xl"
                />

                {/* Details */}
                <div className="flex-1 space-y-3">
                    <h1 className={typography.heading.h4}>{data.name}</h1>

                    <p className={typography.body.base}>
                        {data.description}
                    </p>

                    <p className={typography.body.small}>
                        <strong>Business:</strong> {data.businessType}
                    </p>
                    <p className={typography.body.small}>
                        <strong>Availability:</strong> {data.availability}
                    </p>

                    {/* Services Offered */}
                    <div>
                        <h3 className={combineTypography(typography.heading.h6, "mt-3 mb-2")}>
                            Services Offered
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {data.services.map((service, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium transition-colors hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                                >
                                    {service}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 mt-3">
                        <MapPin size={16} />
                        <span>
                            {data.area}, {data.city}, {data.state} - {data.pincode}
                        </span>
                    </div>

                </div>
            </div>



        </div>

    );
};

export default AutomotiveDetails;
