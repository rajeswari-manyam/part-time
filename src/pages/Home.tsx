import React from "react";
import SearchContainer from "../components/SearchContainer";
const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            {/* Search Section - Full width, no gap */}
            <section className="p-0 w-full">
                <SearchContainer />
            </section>
        </div>
    );
};



export default HomePage;