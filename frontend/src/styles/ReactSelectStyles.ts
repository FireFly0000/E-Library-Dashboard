import { GroupBase, StylesConfig } from "react-select";
// Example type for your options
type OptionType = {
  value: string;
  label: string;
};

const ReactSelectStyles: StylesConfig<
  OptionType,
  false,
  GroupBase<OptionType>
> = {
  control: (base) => ({
    ...base,
    backgroundColor: "var(--input)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
  }),
  input: (base) => ({
    ...base,
    color: "var(--foreground)",
    backgroundColor: "transparent",
    fontWeight: "400",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "var(--primary)" : "var(--input)",
    color: state.isFocused ? "var(--button-text)" : "var(--foreground)",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--foreground)",
    backgroundColor: "var(--input)",
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: "var(--background)",
    height: 170,
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--background)",
    border: "2px solid var(--foreground)", // 👈 sets the border color
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--muted-foreground)", // 🔍 ensures visibility in light mode
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "var(--foreground)", // or any CSS variable or color code
    "&:hover": {
      color: "var(--primary)", // optional hover color
    },
  }),
};

export default ReactSelectStyles;
