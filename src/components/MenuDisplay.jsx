import React from 'react';
import './MenuDisplay.css';

const MenuDisplay = ({ menuType, mainCourse, steakCook, allergies }) => {
  const renderMenu = () => {
    if (menuType === 'Standard') {
      return (
        <div className="menu-details">
          <p>Appetiser: Standard Appetiser</p>
          <p>
            Main Course: {mainCourse}
            {mainCourse === 'Grilled Ribeye' && steakCook && (
              <span>
                <i> - {steakCook}</i>
              </span>
            )}
          </p>
          <p>Dessert: Standard Dessert</p>
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
        <h3>Confirmed Allergies</h3>
        {allergies.length > 0 ? (
          <ul>
            {allergies.map((allergy, index) => (
              <li key={index}>{allergy}</li>
            ))}
          </ul>
        ) : (
          <p>No allergies confirmed.</p>
        )}
        <p className="allergy-note">
          <i>
            If these allergies are not correct, please let one of the crew
            members know as soon as possible. Thank you.
          </i>
        </p>
      </div>
    </div>
  );
};

export default MenuDisplay;
