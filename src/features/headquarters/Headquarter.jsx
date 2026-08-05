import { useEffect, useState } from "react";
import useHeadquarter from "../../hooks/useHeadquarter";
import "./style/headquarter.css";
import ListHeadquarter from "./ListHeadquarter";
import AddHeadquarter from "./AddHeadquarter";

function Headquarter() {
  const { headquarter, getAllHeadquarter, createHeadquarter } = useHeadquarter(
    [],
  );
  const [activeOption, setActiveOption] = useState(1);

  useEffect(() => {
    getAllHeadquarter();
  }, []);

  return (
    <div className="Headquarter">
      <ListHeadquarter headquarter={headquarter} option={setActiveOption}/>
      {activeOption === 2 && (
        <div className="Headquarter__add">
          <AddHeadquarter
            option={setActiveOption}
            createHeadquarter={createHeadquarter}
          />
        </div>
      )}
    </div>
  );
}

export default Headquarter;
