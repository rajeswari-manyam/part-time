// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getWorkerWithSkills, deleteWorkerSkill } from "../services/api.service";
// import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
// import { typography, combineTypography } from "../styles/typography";
// import Button from "../components/ui/Buttons";
// interface WorkerSkill {
//     _id: string;
//     category: string[];
//     subCategory: string;
//     serviceCharge: number;
//     chargeType: "hour" | "day" | "fixed";
// }

// const WorkerList: React.FC = () => {
//     const navigate = useNavigate();

//     const workerId =
//         localStorage.getItem("workerId") ||
//         localStorage.getItem("@worker_id");

//     const [profileExists, setProfileExists] = useState(false);
//     const [skills, setSkills] = useState<WorkerSkill[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchSkills = async () => {
//             if (!workerId) {
//                 setProfileExists(false);
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const res = await getWorkerWithSkills(workerId);
//                 setProfileExists(true);
//                 setSkills(res?.workerSkills || []);
//             } catch (error) {
//                 setProfileExists(false);
//                 setSkills([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSkills();
//     }, [workerId]);

//     const handleDelete = async (skillId: string) => {
//         if (!window.confirm("Delete this skill?")) return;

//         try {
//             const res = await deleteWorkerSkill(skillId);
//             if (res.success) {
//                 setSkills(prev => prev.filter(s => s._id !== skillId));
//             }
//         } catch (err) {
//             alert("Failed to delete skill");
//         }
//     };

//     const formatChargeType = (type: string) =>
//         type === "hour" ? "Hour" : type === "day" ? "Day" : "Fixed";

//     /* ---------------- LOADING ---------------- */
//     if (loading) {
//         return (
//             <div className="py-10 text-center text-gray-500">
//                 Loading worker dashboard...
//             </div>
//         );
//     }

//     /* ---------------- FIRST TIME WORKER - INLINE CARD ---------------- */
//     if (!profileExists) {
//         return (
//             <div className="my-10">
//                 <div className="max-w-xl mx-auto bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 text-center border border-blue-100">
//                     <div className="text-5xl mb-4">👷‍♂️</div>

//                     <h2 className={combineTypography(typography.heading.h3, "mb-3 text-gray-800")}>
//                         Complete Your Worker Profile
//                     </h2>

//                     <p className={combineTypography(typography.body.base, "text-gray-600 mb-6")}>
//                         Set up your professional profile to start receiving job requests and showcase your skills to customers.
//                     </p>

//                     <Button
//                         onClick={() => navigate("/worker-profile")}
//                         variant="primary"
//                         size="lg"
//                     >
//                         Create Worker Profile
//                     </Button>
//                 </div>

//                 {/* Empty state message for skills */}
//                 <div className={combineTypography(typography.body.base, "text-center mt-8 text-gray-500 text-sm")}>
//                     Complete your profile to add skills and start working
//                 </div>
//             </div>
//         );
//     }

//     /* ---------------- EXISTING WORKER - SKILLS DASHBOARD ---------------- */
//     return (
//         <div className="my-6">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className={combineTypography(typography.heading.h3, "text-gray-800")}>My Skills</h2>
//                 <Button
//                     onClick={() => navigate("/add-skills")}
//                     variant="primary"
//                     size="sm"
//                     className="font-semibold"
//                 >
//                     + Add Skill
//                 </Button>
//             </div>

//             {skills.length === 0 ? (
//                 /* NO SKILLS YET */
//                 <div className="bg-white rounded-2xl shadow-lg p-8 text-center border">
//                     <div className="text-4xl mb-4">📝</div>
//                     <h3 className={combineTypography(typography.heading.h5, "mb-2")}>No Skills Added Yet</h3>
//                     <p className={combineTypography(typography.body.base, "text-gray-600 mb-6")}>
//                         Add your first skill to start receiving job requests
//                     </p>
//                     <Button
//                         onClick={() => navigate("/add-skills")}
//                         variant="primary"
//                         size="lg"
//                     >
//                         Add Your First Skill
//                     </Button>
//                 </div>
//             ) : (
//                 /* SKILLS GRID */
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {skills.map(skill => (
//                         <div
//                             key={skill._id}
//                             className="bg-white rounded-2xl shadow-lg p-5 relative hover:shadow-xl transition border border-gray-100"
//                         >
//                             {/* MENU */}
//                             <div className="absolute top-3 right-3">
//                                 <button
//                                     onClick={() =>
//                                         setOpenDropdown(
//                                             openDropdown === skill._id
//                                                 ? null
//                                                 : skill._id
//                                         )
//                                     }
//                                     className="p-2 hover:bg-gray-100 rounded-full transition"
//                                 >
//                                     <MoreVertical size={18} />
//                                 </button>

//                                 {openDropdown === skill._id && (
//                                     <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border z-10">
//                                         <button
//                                             onClick={() => {
//                                                 navigate(`/worker-details/${skill._id}`);
//                                                 setOpenDropdown(null);
//                                             }}
//                                             className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 rounded-t-lg transition"
//                                         >
//                                             <Eye size={14} /> View
//                                         </button>
//                                         <button
//                                             onClick={() => {
//                                                 navigate(`/edit-skill/${skill._id}`);
//                                                 setOpenDropdown(null);
//                                             }}
//                                             className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-blue-600 transition"
//                                         >
//                                             <Edit size={14} /> Edit
//                                         </button>
//                                         <button
//                                             onClick={() => {
//                                                 handleDelete(skill._id);
//                                                 setOpenDropdown(null);
//                                             }}
//                                             className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600 rounded-b-lg transition"
//                                         >
//                                             <Trash2 size={14} /> Delete
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>

//                             <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide">
//                                 {skill.category[0]}
//                             </p>

//                             <h3 className="text-lg font-bold mb-2 text-gray-800">
//                                 {skill.subCategory}
//                             </h3>

//                             <p className="text-green-600 font-bold text-xl mb-4">
//                                 ₹{skill.serviceCharge}
//                                 <span className="text-sm text-gray-500 ml-1 font-normal">
//                                     / {formatChargeType(skill.chargeType)}
//                                 </span>
//                             </p>

//                             <Button
//                                 onClick={() =>
//                                     navigate(`/worker-details/${skill._id}`)
//                                 }
//                                 variant="primary"
//                                 size="lg"
//                             >
//                                 View Details
//                             </Button>
//                         </div>
//                     ))}

//                     {/* ADD SKILL CARD */}
//                     <div
//                         onClick={() => navigate("/add-skills")}
//                         className="border-2 border-dashed border-blue-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-600 transition p-6 min-h-[200px]"
//                     >
//                         <div className="text-4xl mb-2">➕</div>
//                         <p className={combineTypography(typography.heading.h5, "font-bold text-blue-600")}>Add New Skill</p>
//                         <p className={combineTypography(typography.body.base, "text-sm text-gray-500 mt-1")}>Expand your services</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default WorkerList;


export default {};