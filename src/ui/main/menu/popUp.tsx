import type { ReactNode } from "react";

interface PopUpProps {
  isOpen: boolean;
  children: ReactNode;
  setFunc : React.Dispatch<React.SetStateAction<boolean>>;
}

function PopUp({children, setFunc} : PopUpProps){

    return(
        <div className="popUp-screen" onClick={() => setFunc(false)}>
            <div className="popUp-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default PopUp;