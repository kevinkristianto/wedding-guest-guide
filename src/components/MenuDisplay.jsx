import React from 'react';
import './MenuDisplay.css';

const MenuDisplay = ({ menuType, mainCourse, steakCook, allergies }) => {
  const renderMenu = () => {
    if (menuType === 'Standard') {
      return (
        <div className="menu-details">
          <p className="menu-name">
            <b>Amuse Bouche</b>
          </p>
          <p class="menu-description">Crab & Pearls</p>
          <p className="menu-name">
            <b>Beef Carpaccio</b>
          </p>
          <p class="menu-description">Truffle aioli, Parmesan, Rockets</p>
          <p className="menu-name">
            <b>Spinach Ravioli</b>
          </p>
          <p class="menu-description">Spinach, Ricotta Cheese, Creamy Pesto</p>
          <p className="menu-name">
            <b>Lime Granite</b>
          </p>
          <p className="menu-name">
            <b>
              {mainCourse}
              {mainCourse === 'Grilled Ribeye' && steakCook && (
                <span>
                  <i> - {steakCook}</i>
                </span>
              )}
            </b>
          </p>

          <p className="menu-description">
            <em>
              {mainCourse === 'Grilled Ribeye'
                ? 'USDA Angus Ribeye, Potato Pave, Garlic Butter, Peppercorn Sauce'
                : 'Mashed Potato, Green Pea Puree, Tomato Confit, Dill Sauce'}
            </em>
          </p>
          <p className="dessert-section">
            <b>Dessert</b>
          </p>
          <p className="dessert-name">
            <b>Tiramisu al Pistachio</b>
          </p>
          <p class="menu-description">
            Burnt Chocolate, Raspberry coulies, Salted Caramel Tuile
          </p>
        </div>
      );
    } else if (menuType === 'Vegan') {
      return (
        <div className="menu-details">
          <p>Appetiser: Vegan Appetiser</p>
          <p>Main course: Vegan Main course</p>
          <p>Dessert: Vegan Dessert</p>
        </div>
      );
    }
    return <p>Please select a menu type.</p>;
  };

  return (
    <div className="menu-display">
      <h2>Menu</h2>
      {renderMenu()}
      <div className="allergy-section">
        <h3>Allergies</h3>
        {allergies.length > 0 ? (
          <p className="allergy-list">{allergies.join(', ')}</p>
        ) : (
          <p className="no-allergy-note">No allergies confirmed.</p>
        )}
        <p className="allergy-note">
          <i>
            *If these allergies are not correct, please let one of the crew
            members know as soon as possible
          </i>
        </p>
      </div>
    </div>
  );
};

export default MenuDisplay;
