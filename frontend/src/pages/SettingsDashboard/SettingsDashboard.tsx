import React, { useState } from "react";
import "./SettingsDashboard.css";
import BasicSettings from "./SettingsDashboardComponents/BasicSettings";
import SecuredSettings from "./SettingsDashboardComponents/SecuredSettings";
import TrashBin from "./SettingsDashboardComponents/TrashBin";

const settingMenuList = ["Basic Setting", "Secured Setting", "Trash Bin"];

const SettingsDashboard = () => {
  const [selectedMenuId, setSelectedMenuId] = useState(0);
  const settingComponents: React.FC[] = [
    BasicSettings,
    SecuredSettings,
    TrashBin,
  ];
  const SelectedComponent = settingComponents[selectedMenuId];

  return (
    <main
      className=" flex items-center flex-col
      min-h-screen w-screen overflow-hidden"
    >
      {/*menu navigation buttons */}
      <section className="menu-buttons-container fixed top-18">
        {settingMenuList.map((item, index) => (
          <button
            className={`${
              index === selectedMenuId ? "bg-primary text-white" : "text-black"
            }`}
            key={index}
            onClick={() => setSelectedMenuId(index)}
          >
            {item}
          </button>
        ))}
      </section>
      <div
        className="flex justify-center items-center flex-col 
        w-[90vw] max-w-[1400px]"
      >
        {/*Menu contents*/}
        <section className="flex w-full items-center justify-center mt-20">
          <SelectedComponent />
        </section>
      </div>
    </main>
  );
};

export default SettingsDashboard;
