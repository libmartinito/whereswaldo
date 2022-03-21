import React, { useState } from "react";
import "./App.css";

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

function SelectionMenu({ avatarNames, avatarImg }) {
  return (
    <div className="selection">
      {avatarNames.map((el) => (
        <div className="avatar avatar--selection">
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

function Body({ avatarNames, avatarImg }) {
  const [targetLocation, setTargetLocation] = useState({
    x: 0,
    y: 0,
  });
  const updateCoordinates = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const element = e.currentTarget.getBoundingClientRect();
    const newX = x - element.left - 30;
    const newY = y - element.top - 30;
    setTargetLocation({ x: newX, y: newY });
  };
  return (
    <div className="body">
      <div className="body__wrapper">
        <div
          className="body__img"
          onClick={updateCoordinates}
          aria-hidden="true"
        >
          <Target location={targetLocation} />
          <SelectionMenu avatarNames={avatarNames} avatarImg={avatarImg} />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [avatarNames] = useState(["Waldo", "Odlaw", "Wenda"]);
  const [avatarImg] = useState({
    Waldo: "./images/waldo.webp",
    Odlaw: "./images/odlaw.webp",
    Wenda: "./images/wenda.webp",
  });

  return (
    <div className="container">
      <Header avatarNames={avatarNames} avatarImg={avatarImg} />
      <Body avatarNames={avatarNames} avatarImg={avatarImg} />
    </div>
  );
}

export default App;
