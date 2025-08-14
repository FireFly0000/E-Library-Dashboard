import ReactSelectStyles from "@/styles/ReactSelectStyles";
import { useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

type NewAuthorInputProps = {
  setAuthorName: (name: string) => void;
  setAuthorCountry: (country: string) => void;
};

const NewAuthorInput: React.FC<NewAuthorInputProps> = ({
  setAuthorName,
  setAuthorCountry,
}) => {
  const countries = useMemo(() => countryList().getData(), []);

  return (
    <div>
      <div className="input-field-container">
        <label className="form-label">Author's Name</label>
        <input
          type="text"
          placeholder="Enter Author's Name"
          className="form-input"
          onChange={(e) => setAuthorName(e.target.value)}
        />
      </div>

      <div className="input-field-container">
        <label className="form-label">Author's country</label>
        <Select
          options={countries}
          onChange={(e) => {
            if (e) setAuthorCountry(e.label);
          }}
          styles={ReactSelectStyles}
          placeholder="Select a country"
        />
      </div>
    </div>
  );
};

export default NewAuthorInput;
