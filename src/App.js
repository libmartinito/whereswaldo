import React, { useState } from "react";
import "./App.css";

function Header({ avatarNames, avatarImg }) {
  return (
    <div className="header">
      <h1 className="header__title">Where's Waldo</h1>
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

const Target = () => {
  return <div className="target"></div>;
};

const SelectionMenu = ({ avatarNames, avatarImg }) => {
  return (
    <div className="selection">
      {avatarNames.map((el) => (
        <div className="avatar">
          <img src={avatarImg[el]} alt={el} className="avatar__img" />
          <div className="avatar__name">{el}</div>
        </div>
      ))}
    </div>
  );
};

const Body = ({ avatarNames, avatarImg }) => {
  return (
    <div className="body">
      <Target />
      <SelectionMenu avatarNames={avatarNames} avatarImg={avatarImg} />
    </div>
  );
};

function App() {
  const [avatarNames] = useState(["Waldo", "Odlaw", "Wenda"]);
  const [avatarImg] = useState({
    Waldo: "./images/waldo.webp",
    Odlaw: "./images/odlaw.webp",
    Wenda: "./images/wenda.webp",
  });

  const getCoordinates = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const element = e.currentTarget.getBoundingClientRect();
    console.log(mouseX);
    console.log(mouseY);
    console.log(mouseX - element.left);
    console.log(mouseY - element.top);
  };

  return (
    <div className="container">
      <Header avatarNames={avatarNames} avatarImg={avatarImg} />
      <Body
        avatarNames={avatarNames}
        avatarImg={avatarImg}
        getCoordinates={getCoordinates}
      />
    </div>
  );
}

export default App;
