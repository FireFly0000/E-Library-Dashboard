import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/DatePicker.css";
import { parse, format } from "date-fns";

type CustomDatePickerProps = {
  date: string;
  setDate: (date: string) => void;
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  date,
  setDate,
}) => {
  return (
    <div>
      <DatePicker
        selected={
          date
            ? (() => {
                const parsed = parse(date, "MM-dd-yyyy", new Date());
                return isNaN(parsed.getTime()) ? null : parsed;
              })()
            : null
        }
        onChange={(date) => {
          if (date) {
            setDate(format(date, "MM-dd-yyyy"));
          } else {
            setDate(""); // optional: handle clearing
          }
        }}
        dateFormat="MM-dd-yyyy"
        placeholderText="MM-DD-YYYY"
        className="custom-date-input"
        calendarClassName="custom-datepicker"
      />
    </div>
  );
};

export default CustomDatePicker;
