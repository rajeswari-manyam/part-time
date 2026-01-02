// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getUserById, getWorkerById, updateUserById } from "../services/api.service";
// import { useAuth } from "../context/AuthContext";

// const EditProfile: React.FC = () => {
//     const navigate = useNavigate();
//     const { user } = useAuth();
//     const userId = user?._id;

//     // Form state
//     const [name, setName] = useState("");
//     const [phone, setPhone] = useState("");
//     const [latitude, setLatitude] = useState("");
//     const [longitude, setLongitude] = useState("");
//     const [image, setImage] = useState<File | null>(null); // image file
//     const [imagePreview, setImagePreview] = useState<string>(""); // preview URL
//     const [loading, setLoading] = useState(false);
//     const [fetching, setFetching] = useState(true);

//     // Prefill user data
//     useEffect(() => {
//         if (!userId) return;

//         const fetchData = async () => {
//             setFetching(true);
//             try {
//                 let res;
//                 if ((user as any)?.role === "Worker") {
//                     res = await getWorkerById(userId);
//                 } else {
//                     res = await getUserById(userId);
//                 }

//                 if (res.success) {
//                     setName(res.data.name || "");
//                     setPhone(res.data.phone || "");
//                     setLatitude(res.data.latitude?.toString() || "");
//                     setLongitude(res.data.longitude?.toString() || "");
//                     if (res.data.image) setImagePreview(res.data.image);
//                 }
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             } finally {
//                 setFetching(false);
//             }
//         };

//         fetchData();
//     }, [userId, user]);

//     // Handle image selection
//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setImage(e.target.files[0]);
//             setImagePreview(URL.createObjectURL(e.target.files[0]));
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!userId) return;
//         setLoading(true);

//         try {
//             const formData = new FormData();
//             formData.append("name", name);
//             formData.append("phone", phone);
//             formData.append("latitude", latitude);
//             formData.append("longitude", longitude);
//             if (image) formData.append("image", image);

//             const res = await updateUserById(userId, formData);

//             if (res.success) {
//                 alert("Profile updated successfully!");
//                 navigate("/profile");
//             } else {
//                 alert("Failed to update profile!");
//             }
//         } catch (error) {
//             console.error("Update error:", error);
//             alert("Error updating profile");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (fetching) return <div className="text-center mt-10">Loading profile...</div>;

//     return (
//         <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
//             <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 {/* Profile Image */}
//                 <div className="flex flex-col items-center">
//                     <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border">
//                         {imagePreview ? (
//                             <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
//                         ) : (
//                             <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
//                                 No Image
//                             </div>
//                         )}
//                     </div>
//                     <input type="file" accept="image/*" onChange={handleImageChange} />
//                 </div>

//                 {/* Name */}
//                 <input
//                     type="text"
//                     placeholder="Name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-lg"
//                     required
//                 />

//                 {/* Phone */}
//                 <input
//                     type="tel"
//                     placeholder="Phone"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-lg"
//                     required
//                 />

//                 {/* Latitude */}
//                 <input
//                     type="text"
//                     placeholder="Latitude"
//                     value={latitude}
//                     onChange={(e) => setLatitude(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-lg"
//                 />

//                 {/* Longitude */}
//                 <input
//                     type="text"
//                     placeholder="Longitude"
//                     value={longitude}
//                     onChange={(e) => setLongitude(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-lg"
//                 />

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full py-3 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white rounded-xl mt-4"
//                 >
//                     {loading ? "Updating..." : "Update Profile"}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default EditProfile;
export default {};