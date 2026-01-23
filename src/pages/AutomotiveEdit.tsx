// import React, { useEffect, useState, ChangeEvent } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//     getAutomotiveById,
//     updateAutomotive,
//     AutomotiveService,
//     CreateAutomotiveData,
// } from "../services/CategoriesApi.service";

// const AutomotiveEdit: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();

//     const [data, setData] = useState<AutomotiveService | null>(null);
//     const [formData, setFormData] = useState<CreateAutomotiveData | null>(null);
//     const [images, setImages] = useState<File[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!id) return;
//         const fetchData = async () => {
//             try {
//                 const res = await getAutomotiveById(id);
//                 setData(res.data);
//                 setFormData({
//                     userId: res.data.userId,
//                     name: res.data.name,
//                     businessType: res.data.businessType,
//                     phone: res.data.phone,
//                     email: res.data.email,
//                     services: res.data.services,
//                     experience: res.data.experience.toString(),
//                     availability: res.data.availability,
//                     area: res.data.area,
//                     city: res.data.city,
//                     state: res.data.state,
//                     pincode: res.data.pincode,
//                     latitude: res.data.latitude.toString(),
//                     longitude: res.data.longitude.toString(),
//                     priceRange: res.data.priceRange,
//                     description: res.data.description,
//                     images: [],
//                 });
//                 setLoading(false);
//             } catch (err) {
//                 console.error(err);
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [id]);

//     if (loading || !formData || !data) {
//         return <div className="p-8 text-center">Loading...</div>;
//     }

//     const handleChange = (
//         e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//     ) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleServiceChange = (index: number, value: string) => {
//         const newServices = [...formData.services];
//         newServices[index] = value;
//         setFormData({ ...formData, services: newServices });
//     };

//     const handleAddService = () => {
//         setFormData({ ...formData, services: [...formData.services, ""] });
//     };

//     const handleRemoveService = (index: number) => {
//         const newServices = [...formData.services];
//         newServices.splice(index, 1);
//         setFormData({ ...formData, services: newServices });
//     };

//     const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) setImages(Array.from(e.target.files));
//     };
// const handleSubmit = async () => {
//     if (!formData) return;
//     try {
//         const updatedData = { ...formData, images };
//         await updateAutomotive(id!, updatedData);
//         // ✅ Navigate to automotive list after successful update
//         navigate("/automotive-list");
//     } catch (err) {
//         console.error("Error updating automotive:", err);
//         alert("Failed to update automotive service. Please try again.");
//     }
// };

//     if (loading) return <div className="p-8 text-center">Loading...</div>;

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//             <div className="max-w-7xl mx-auto">
//                 {/* Mobile Header */}
//                 <div className="mb-6 lg:hidden">
//                     <h1 className="text-2xl font-bold text-gray-900">Edit Automotive</h1>
//                     <p className="text-sm text-gray-600 mt-1">Update service information</p>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
//                     {/* Left Panel: Current Details */}
//                     <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
//                         <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
//                             Current Automotive Details
//                         </h2>

//                         <div className="space-y-4 md:space-y-6">
//                             <div>
//                                 <div className="text-sm text-gray-500 mb-1">Business Type</div>
//                                 <div className="text-sm md:text-base font-medium text-gray-900">
//                                     {data.businessType}
//                                 </div>
//                             </div>

//                             <div>
//                                 <div className="text-sm text-gray-500 mb-1">Name</div>
//                                 <div className="text-sm md:text-base font-medium text-gray-900">
//                                     {data.name}
//                                 </div>
//                             </div>

//                             <div>
//                                 <div className="text-sm text-gray-500 mb-1">Contact</div>
//                                 <div className="text-sm md:text-base text-gray-900">
//                                     <div>Phone: {data.phone}</div>
//                                     <div className="break-all">Email: {data.email}</div>
//                                 </div>
//                             </div>

//                             <div>
//                                 <div className="text-sm text-gray-500 mb-1">Services</div>
//                                 <div className="text-sm md:text-base text-gray-900">
//                                     {data.services.join(", ")}
//                                 </div>
//                             </div>

//                             <div>
//                                 <div className="text-sm text-gray-500 mb-1">Experience</div>
//                                 <div className="text-sm md:text-base font-medium text-gray-900">
//                                     {data.experience} years
//                                 </div>
//                             </div>

//                             <div>
//                                 <div className="text-sm text-gray-500 mb-1">Availability</div>
//                                 <div className="text-sm md:text-base text-gray-900">
//                                     {data.availability}
//                                 </div>
//                             </div>

//                             <div>
//                                 <div className="text-sm text-gray-500 mb-1">Price Range</div>
//                                 <div className="text-lg md:text-xl font-semibold text-green-600">
//                                     ₹{data.priceRange}
//                                 </div>
//                             </div>

//                             <div>
//                                 <div className="text-sm text-gray-500 mb-1">Description</div>
//                                 <div className="text-sm md:text-base text-gray-900">
//                                     {data.description}
//                                 </div>
//                             </div>

//                             <div>
//                                 <div className="text-sm text-gray-500 mb-1">Location</div>
//                                 <div className="text-sm md:text-base text-gray-900">
//                                     <div><strong>Area:</strong> {data.area}</div>
//                                     <div><strong>City:</strong> {data.city}</div>
//                                     <div><strong>State:</strong> {data.state}</div>
//                                     <div><strong>Pincode:</strong> {data.pincode}</div>
//                                 </div>
//                             </div>

//                             {data.images && data.images.length > 0 && (
//                                 <div>
//                                     <div className="text-sm text-gray-500 mb-2">Images</div>
//                                     <div className="flex gap-2 flex-wrap">
//                                         {data.images.map((img, idx) => (
//                                             <img
//                                                 key={idx}
//                                                 src={`http://13.204.29.0:3001/${img}`}
//                                                 alt="service"
//                                                 className="w-20 h-20 md:w-24 md:h-24 object-cover rounded border border-gray-200"
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Right Panel: Edit Form */}
//                     <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
//                         <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
//                             Edit Automotive Information
//                         </h2>

//                         <div className="space-y-4 md:space-y-6">
//                             {/* Business Type */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Business Type *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="businessType"
//                                     value={formData.businessType}
//                                     onChange={handleChange}
//                                     placeholder="e.g., Auto Repair Shop"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>

//                             {/* Name */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Name *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     placeholder="Business Name"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>

//                             {/* Phone */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Phone *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="phone"
//                                     value={formData.phone}
//                                     onChange={handleChange}
//                                     placeholder="Phone Number"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>

//                             {/* Email */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Email *
//                                 </label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     placeholder="Email Address"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>

//                             {/* Services */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Services Offered *
//                                 </label>
//                                 {formData.services.map((service, idx) => (
//                                     <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
//                                         <input
//                                             type="text"
//                                             value={service}
//                                             onChange={(e) => handleServiceChange(idx, e.target.value)}
//                                             placeholder="Service name"
//                                             className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
//                                         />
//                                         <button
//                                             onClick={() => handleRemoveService(idx)}
//                                             className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium text-sm"
//                                         >
//                                             Remove
//                                         </button>
//                                     </div>
//                                 ))}
//                                 <button
//                                     onClick={handleAddService}
//                                     className="mt-2 w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium text-sm"
//                                 >
//                                     + Add Service
//                                 </button>
//                             </div>

//                             {/* Experience */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Experience (Years) *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="experience"
//                                     value={formData.experience}
//                                     onChange={handleChange}
//                                     placeholder="Years of Experience"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>

//                             {/* Availability */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Availability
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="availability"
//                                     value={formData.availability}
//                                     onChange={handleChange}
//                                     placeholder="e.g., Mon-Fri 9AM-6PM"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>

//                             {/* Location Section */}
//                             <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
//                                 <h3 className="text-base font-semibold text-gray-900 mb-4">
//                                     Location Details
//                                 </h3>

//                                 <div className="space-y-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             Area
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="area"
//                                             value={formData.area}
//                                             onChange={handleChange}
//                                             placeholder="Area/Locality"
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             City
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="city"
//                                             value={formData.city}
//                                             onChange={handleChange}
//                                             placeholder="City"
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             State
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="state"
//                                             value={formData.state}
//                                             onChange={handleChange}
//                                             placeholder="State"
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             Pincode
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="pincode"
//                                             value={formData.pincode}
//                                             onChange={handleChange}
//                                             placeholder="Pincode"
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Price Range */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     💰 Price Range (₹) *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="priceRange"
//                                     value={formData.priceRange}
//                                     onChange={handleChange}
//                                     placeholder="Amount in ₹"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>

//                             {/* Description */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Description
//                                 </label>
//                                 <textarea
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleChange}
//                                     placeholder="Describe your automotive service..."
//                                     rows={4}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
//                                 />
//                             </div>

//                             {/* Images */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Upload New Images
//                                 </label>
//                                 <input
//                                     type="file"
//                                     multiple
//                                     onChange={handleFileChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
//                                 />
//                             </div>

//                             {/* Submit Button */}
//                             <button
//                                 onClick={handleSubmit}
//                                 className="w-full px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-semibold text-sm md:text-base"
//                             >
//                                 Update Automotive Service
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             </div>
//             );
// };

//             export default AutomotiveEdit;
export default {};