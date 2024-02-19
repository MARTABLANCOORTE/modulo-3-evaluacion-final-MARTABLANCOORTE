import "./scss/App.scss";

import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Filters from "./Filters/Filters";
import CharacterList from "./Characters/CharacterList";
import CharacterDetail from "./Pages/CharacterDetail";
import ls from "../components/services/LocalStorage.js";
import fetchCharacters from "../components/services/fetch.js";
import Footer from "./Pages/footer.jsx";
import Header from "./Pages/header.jsx";
import Notfound from './Pages/Notfound.jsx';

function App() {
  // 1. Variables de estado
  const [characters, setcharacters] = useState(ls.get("characters", []));
  const [filterCharacter, setfilterCharacter] = useState("");
  const [filterStudent, setfilterStudent] = useState("all");
  const [filterHouse, setfilterHouse] = useState("all");
  const [filterGender, setfilterGender] = useState("all");
  const [filterAlive, setfilterAlive] = useState("all");
  
  // 2. useEffect

  useEffect(() => {
    // Cuando carga la página
    if (!ls.includes("characters")) {
      fetchCharacters().then((data) => {
        setcharacters(data);
        ls.set("characters", data);
      });
    }
  }, []);

  // 3. funciones de eventos

  // Función para manejar el cambio en los filtros
  const handleFilterCharacter = (value) => {
    setfilterCharacter(value);
  };

  const handleFilterStudent = (value) => {
    setfilterStudent(value);
  };

  const handleFilterHouse = (value) => {
    setfilterHouse(value);
  };

  const handleFilterGender = (value) => {
    setfilterGender(value);
  };

  const handleFilterAlive = (value) => {
    setfilterAlive(value);
  };

  // Función para aplicar el filtro Student - Staff - All
  const applyFilterStudent = (data) => {
    if (filterStudent === "All") {
      return data;
    } else if (filterStudent === "Students") {
      return data.filter(
        (character) => character.hogwartsStudent === "Student"
      );
    } else if (filterStudent === "Staff") {
      return data.filter((character) => character.hogwartsStaff === "Staff");
    } else {
      return data;
    }
  };

  // Función para aplicar el filtro Student - Staff - All
  const applyFilterHouse = (data) => {
    if (filterHouse === "All") {
      return data;
    } else if (filterHouse === "Gryffindor") {
      return data.filter((character) => character.house === "Gryffindor");
    } else if (filterHouse === "Hufflepuff") {
      return data.filter((character) => character.house === "Gryffindor");
    } else if (filterHouse === "Ravenclaw") {
      return data.filter((character) => character.house === "Gryffindor");
    } else if (filterHouse === "Slytherin") {
      return data.filter((character) => character.house === "Gryffindor");
    } else {
      return data;
    }
  };

  // Función para aplicar el filtro por nombre
  const applyFilterName = (data, filterCharacter) => {
    if (!filterCharacter) {
      return <p>There is no character with that name. Please try again </p>;
    } 
    else {
      return data.filter((character) =>
        character.name.toLowerCase().includes(filterCharacter.toLowerCase())
      );
    }
  };

  // Función para el filtro de genero:
  const applyFilterGender = (data, filterGender) => {
    if (filterGender === "all") {
      return data;
    } else {
      return data.filter((character) => {
        if (filterGender === "female") {
          return character.gender === "female";
        } else if (filterGender === "male") {
          return character.gender === "male";
        }
      });
    }
  };

  //Función para el filtro de status (vivo o muerto):
  const applyFilterAlive = (data) => {
    if (filterAlive === "All") {
      return data;
    } 
    else if (filterAlive === "alive") {
      return data.filter((character) => character.alive === "true")
    } 
    else if (filterAlive === "dead") 
      {return data.filter((character) => character.alive === "false")
    }
  };

  // 4. variables para el html

  const datacharacters = [...characters].sort((a,b) =>{
    return a.name.localeCompare(b.name)
  });

  //Para los filtros:

  //filtros - uno engloba al otro:
  const filteredCharacterbyName = applyFilterName(
    datacharacters,
    setfilterStudent
  );
  const filteredCharactersByStudent = applyFilterStudent(
    filteredCharacterbyName,
    setfilterStudent
  );
  const filteredCharactersByHouse = applyFilterHouse(
    filteredCharactersByStudent,
    setfilterHouse
  );
  const filteredCharactersByGender = applyFilterGender(
    filteredCharactersByHouse,
    setfilterGender
  );
  const filteredCharacters = applyFilterAlive(
    filteredCharactersByGender,
    setfilterAlive
  );

  //para la pagina de Details:
  const findCharacter = (id) => {
    return characters.find((character) => character.id === id);
  };

  // Reset: resetear los filtros: 
  const handleResetFilters = () => {
    setfilterCharacter("");
    setfilterStudent("all");
    setfilterHouse("Gryffindor");
    setfilterGender("all");
    setfilterAlive("all");
  }

  // 5. Html en el return

  return (
    <div className="page">
      <Header/>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <div className="col2">
                <div>
                  <Filters
                    filterCharacter={filterCharacter}
                    filterStudent={filterStudent}
                    filterHouse={filterHouse}
                    filterGender={filterGender}
                    filterAlive={filterAlive}
                    handleFilterCharacter={handleFilterCharacter}
                    handleFilterStudent={handleFilterStudent}
                    handleFilterHouse={handleFilterHouse}
                    handleFilterGender={handleFilterGender}
                    handleFilterAlive={handleFilterAlive}
                    handleResetFilters = {handleResetFilters}
                  />
                </div>
                <div>
                  <CharacterList characters={filteredCharacters} />
                </div>
              </div>
            }
          />
          <Route
            path="/character/:id"
            element={<CharacterDetail findCharacter={findCharacter} /> || <Notfound/>}
          />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
