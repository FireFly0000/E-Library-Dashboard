import { useRef, useEffect, useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import "@/styles/CustomSelect.css";

type CustomSelectProps<Item> = {
  options: Item[];
  getKey: (option: Item) => number;
  getLabel: (option: Item) => ReactNode;
  getValue: (option: Item) => ReactNode;
  changeKey: (key: number) => void;
};

function CustomSelect<ItemType>({
  options,
  getKey,
  getLabel,
  changeKey,
}: CustomSelectProps<ItemType>) {
  const filterWrapperRef = useRef<HTMLDivElement | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ItemType>(options[0]);

  const toggleDropdown = () => setFilterOpen((prev) => !prev);

  const handleOnChange = (e: React.MouseEvent, item: ItemType) => {
    e.stopPropagation();
    setSelectedOption(item);
    changeKey(getKey(item));
    setFilterOpen(false);
    filterWrapperRef.current?.blur();
  };

  // Close dropdown when clicking outside of the filter component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterWrapperRef.current &&
        !filterWrapperRef.current.contains(event.target as Node) &&
        filterOpen !== false
      ) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  return (
    <div
      className="custom-select-root"
      ref={filterWrapperRef}
      onClick={toggleDropdown}
      tabIndex={0}
    >
      {/*current selected option*/}
      <div className="custom-select-current">
        {getLabel(selectedOption)}
        <ChevronDown className="custom-select-icon" />
      </div>
      {/*current selected option*/}

      {/*Options list*/}
      {filterOpen && (
        <div className="custom-select-options-container">
          {options.map((item: ItemType, index) => (
            <div key={index} onClick={(e) => handleOnChange(e, item)}>
              {getLabel(item)}
            </div>
          ))}
        </div>
      )}
      {/*Options list*/}
    </div>
  );
}

export default CustomSelect;
