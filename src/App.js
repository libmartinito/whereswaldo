import React, { useState, useRef } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVzIojoTLRP5le_jTHiKO5b--9LOCduaQ",

  authDomain: "whereswaldo-f27a5.firebaseapp.com",

  projectId: "whereswaldo-f27a5",

  storageBucket: "whereswaldo-f27a5.appspot.com",

  messagingSenderId: "293880886504",

  appId: "1:293880886504:web:12b0b740a3651bc4c1055d",
};

function Header({ avatarNames, avatarImg }) {
  return (
    <div className="header">
      <h1 className="header__title">Where&apos;s Waldo</h1>
      <div className="header__avatars">
        {avatarNames.map((el) => (
          <div className="avatar">
            <img src={avatarImg[el]} alt={el} className="avatar__img" />
            <div className="avatar__name">{el}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Target({ location }) {
  return (
    <div
      className="target"
      style={{
        position: "absolute",
        left: `${location.x}px`,
        top: `${location.y}px`,
      }}
    />
  );
}

function SelectionMenu({
  avatarNames,
  avatarImg,
  location,
  handleSelectionClick,
}) {
  return (
    <div
      className="selection"
      style={{
        position: "absolute",
        left: `${location.x}px`,
        top: `${location.y}px`,
      }}
    >
      {avatarNames.map((el) => (
        <div
          className="avatar avatar--selection"
          title={el}
          onClick={handleSelectionClick}
          aria-hidden="true"
        >
          <img
            src={avatarImg[el]}
            alt={el}
            className="avatar__img avatar__img--selection"
          />
          <div className="avatar__name avatar__name--selection">{el}</div>
        </div>
      ))}
    </div>
  );
}

function Mark({ el }) {
  return (
    <div
      className="mark"
      style={{
        position: "absolute",
        left: `${el.x - 40}px`,
        top: `${el.y - 40}px`,
      }}
    />
  );
}

function Body({
  avatarNames,
  avatarImg,
  handleSelectionClick,
  isMenuHidden,
  targetLocation,
  menuLocation,
  updateCoordinates,
  markCoordinates,
}) {
  return (
    <div className="body">
      <div className="body__wrapper">
        <div
          className="body__img"
          onClick={updateCoordinates}
          aria-hidden="true"
        >
          {isMenuHidden ? null : (
            <>
              <Target location={targetLocation} />
              <SelectionMenu
                avatarNames={avatarNames}
                avatarImg={avatarImg}
                location={menuLocation}
                handleSelectionClick={handleSelectionClick}
              />
            </>
          )}
          {markCoordinates.map((el) => (
            <Mark el={el} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StartModal({ playerName, handlePlayerNameChange, updatePlayerInfo }) {
  return (
    <div className="start-modal">
      <div className="start-modal__content">
        <div className="start-modal__copy">Please enter your name.</div>
        <input
          className="start-modal__input"
          value={playerName}
          onChange={handlePlayerNameChange}
        />
        <button type="button" className="button" onClick={updatePlayerInfo}>
          Play
        </button>
      </div>
    </div>
  );
}

function App() {
  initializeApp(firebaseConfig);
  const db = getFirestore();
  const [avatarNames] = useState(["Waldo", "Odlaw", "Wenda"]);
  const [avatarImg] = useState({
    Waldo: "./images/waldo.webp",
    Odlaw: "./images/odlaw.webp",
    Wenda: "./images/wenda.webp",
  });

  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const targetLocation = useRef({ x: 0, y: 0 });
  const [menuLocation, setMenuLocation] = useState({ x: 0, y: 0 });

  const selected = useRef("");
  const refCoordinates = useRef({});
  const markCoordinates = useRef([]);

  const [playerName, setPlayerName] = useState("");
  const [isModalDisplayed, setIsModalDisplayed] = useState(true);

  const updateSelected = (e) => {
    const newSelected = e.currentTarget.title;
    selected.current = newSelected;
  };

  const updateRefCoordinates = async () => {
    const docRef = doc(db, "coordinates", selected.current.toLowerCase());
    const docSnap = await getDoc(docRef);
    refCoordinates.current = docSnap.data();
  };

  const updateMarkCoordinates = () => {
    const location = targetLocation.current;
    const ref = refCoordinates.current;
    if (
      location.x < ref.x &&
      location.y < ref.y &&
      location.x + 70 > ref.x &&
      location.y + 70 > ref.y
    ) {
      const newMarkCoordinates = markCoordinates.current;
      newMarkCoordinates.push(ref);

      markCoordinates.current = newMarkCoordinates;
    }
  };

  const updateMenuDisplay = () => {
    if (isMenuHidden) {
      setIsMenuHidden(false);
    } else {
      setIsMenuHidden(true);
    }
  };

  const handleSelectionClick = async (e) => {
    e.stopPropagation();
    updateSelected(e);
    await updateRefCoordinates();
    updateMarkCoordinates();
    updateMenuDisplay();
  };

  const updateCoordinates = (e) => {
    e.stopPropagation();
    updateMenuDisplay();
    const x = e.clientX;
    const y = e.clientY;
    const element = e.currentTarget.getBoundingClientRect();
    const newX = x - element.left - 35;
    const newY = y - element.top - 35;
    targetLocation.current = { x: newX, y: newY };
    setMenuLocation({ x: newX + 70, y: newY + 35 });
  };

  const handlePlayerNameChange = (e) => {
    const name = e.target.value;
    setPlayerName(name);
  };

  const handlePlayClick = async () => {
    const docRef = doc(db, "player", "current");
    await setDoc(docRef, {
      name: playerName,
      start: serverTimestamp(),
    });
    setIsModalDisplayed(false);
  };

  return (
    <div className="container">
      <Header avatarNames={avatarNames} avatarImg={avatarImg} />
      <Body
        avatarNames={avatarNames}
        avatarImg={avatarImg}
        handleSelectionClick={handleSelectionClick}
        isMenuHidden={isMenuHidden}
        targetLocation={targetLocation.current}
        menuLocation={menuLocation}
        updateCoordinates={updateCoordinates}
        updateMenuDisplay={updateMenuDisplay}
        markCoordinates={markCoordinates.current}
      />
      {isModalDisplayed ? (
        <StartModal
          playerName={playerName}
          handlePlayerNameChange={handlePlayerNameChange}
          updatePlayerInfo={handlePlayClick}
        />
      ) : null}
    </div>
  );
}

export default App;
