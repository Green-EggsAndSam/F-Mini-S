import { useState } from "react";

interface DropdownProps {
  title: string;
  children: React.ReactNode;
}

function Dropdown({ title, children }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown">
      <button onClick={() => setOpen(!open)} className="dropdown-btn">
        <img src='../../../../../images/dropdown-arrow.png' className={`dropdown-img ${open ?"open" :""}`}></img>{title}
      </button>

      <div className={`dropdown-content ${open ? "open" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export default Dropdown;
