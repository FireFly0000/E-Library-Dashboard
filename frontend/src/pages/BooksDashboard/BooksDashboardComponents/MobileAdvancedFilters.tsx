import React from "react";
import SlideDown from "react-slidedown";
import { Ellipsis, CircleX } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { BooksCategoryOptions, countryList } from "@/utils/constants";

type FilterList = {
  key: number;
  label: string;
  value: string;
};

type FilterListProps = {
  list: FilterList[];
  search: string;
  setValue: (value: string) => void;
};

const FilterList: React.FC<FilterListProps> = ({ list, search, setValue }) => {
  const searchedList = list.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-3 items-center place-items-center w-[95vw] max-h-[300px] overflow-y-auto">
      {searchedList.map((item, index) => (
        <div
          className="flex text-lg text-foreground hover:text-primary text-center items-center justify-center 
            transition-colors duration-300 border-border border-[2px] 
            p-2 select-none cursor-pointer w-full h-full"
          key={index}
          onClick={() => {
            setValue(item.value);
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

type MobileAdvancedFiltersProps = {
  setCategory: (category: string) => void;
  setCountry: (country: string) => void;
};

const MobileAdvancedFilters: React.FC<MobileAdvancedFiltersProps> = ({
  setCategory,
  setCountry,
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const mobileFilterRef = useRef<HTMLDivElement | null>(null);
  const [selectedListName, setSelectedListName] = useState<string>("category");
  const [search, setSearch] = useState("");

  // Close mobile filter when clicking outside of the filter component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileFilterRef.current &&
        !mobileFilterRef.current.contains(event.target as Node) &&
        mobileFiltersOpen !== false
      ) {
        setMobileFiltersOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileFiltersOpen]);

  // Prevent background scroll when mobile filters are open
  const originalOverflow = useRef<string | null>(null);
  useEffect(() => {
    if (mobileFiltersOpen) {
      // Prevent background scroll
      originalOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      // Restore original overflow
      document.body.style.overflow = originalOverflow.current || "";
    }

    return () => {
      document.body.style.overflow = originalOverflow.current || "";
    };
  }, [mobileFiltersOpen]);

  return (
    <div
      className="xl:hidden flex flex-col items-center justify-center relative"
      ref={mobileFilterRef}
    >
      {!mobileFiltersOpen ? (
        <Ellipsis
          className="text-foreground hover:text-primary cursor-pointer"
          onClick={() => setMobileFiltersOpen((prev) => !prev)}
        />
      ) : (
        <CircleX
          className="text-destructive cursor-pointer"
          onClick={() => setMobileFiltersOpen((prev) => !prev)}
        />
      )}
      <SlideDown>
        {mobileFiltersOpen ? (
          <div className="fixed left-1/2 -translate-x-1/2 z-50 mt-2 border-primary border-[2px] bg-card rounded-lg">
            {/*Current filter selection */}
            <div className="flex items-center justify-center w-[95vw] text-center">
              <div
                className={`text-lg hover:text-primary transition-colors duration-300 border-border border-[2px] p-2 select-none cursor-pointer w-full ${
                  selectedListName === "category"
                    ? "text-primary"
                    : "text-foreground"
                }`}
                onClick={() => {
                  setSelectedListName("category");
                  setSearch("");
                }}
              >
                Category
              </div>
              <div
                className={`text-lg hover:text-primary transition-colors duration-300 border-border border-[2px] p-2 select-none cursor-pointer w-full ${
                  selectedListName === "country"
                    ? "text-primary"
                    : "text-foreground"
                }`}
                onClick={() => {
                  setSelectedListName("country");
                  setSearch("");
                }}
              >
                Country
              </div>
            </div>
            <input
              type="text"
              placeholder="Search options..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input w-full"
            />

            {/*Category Filters list */}
            {selectedListName === "category" && (
              <FilterList
                list={BooksCategoryOptions}
                search={search}
                setValue={setCategory}
              />
            )}

            {/*Country Filters list */}
            {selectedListName === "country" && (
              <FilterList
                list={countryList}
                search={search}
                setValue={setCountry}
              />
            )}
          </div>
        ) : (
          <></>
        )}
      </SlideDown>
    </div>
  );
};

export default MobileAdvancedFilters;
