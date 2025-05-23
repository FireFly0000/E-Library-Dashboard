import { useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

type NewAuthorInputProps = {
  setAuthorName: (name: string) => void;
  setAuthorCountry: (country: string) => void;
  setAuthorDateOfBirth: (date: string) => void;
};

const NewAuthorInput: React.FC<NewAuthorInputProps> = ({
  setAuthorName,
  setAuthorCountry,
  setAuthorDateOfBirth,
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
        />
      </div>

      <div className="input-field-container">
        <label className="form-label">Author's birthdate</label>
        <input
          type="date"
          className="form-input"
          onChange={(e) => setAuthorDateOfBirth(e.target.value)}
        />
      </div>
    </div>
  );
};

export default NewAuthorInput;
