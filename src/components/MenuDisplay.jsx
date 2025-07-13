import React from 'react';
import './MenuDisplay.css';

const MenuDisplay = ({
  menuType,
  appetiser,
  mainCourse,
  steakCook,
  allergies,
}) => {
  const renderMenu = () => {
    if (mainCourse === 'Grilled Ribeye' || mainCourse === 'Salmon al Forno') {
      return (
        <div className="menu-details">
          <p className="menu-name">
            <b>
              Amuse Bouche - <i>Crab & Pearls</i>
            </b>
          </p>

          <p className="menu-name">
            <b>
              {appetiser === 'Chicken Roulade'
                ? 'Chicken Roulade'
                : 'Beef Carpaccio'}
            </b>
          </p>
          <p className="menu-description">
            {appetiser === 'Chicken Roulade'
              ? 'Saffron Aioli, Microgreens, Orange Dressing'
              : 'Truffle aioli, Parmesan, Rockets'}
          </p>

          <p className="menu-name">
            <b>Spinach Ravioli</b>
          </p>
          <p class="menu-description">Spinach, Ricotta Cheese, Creamy Pesto</p>
          <p className="menu-name">
            <b>Lime Granite</b>
          </p>
          {mainCourse ? (
            <>
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
                  {{
                    'Grilled Ribeye':
                      'USDA Angus Ribeye, Potato Pave, Garlic Butter, Peppercorn Sauce',
                    'Salmon al Forno':
                      'Mashed Potato, Green Pea Puree, Tomato Confit, Dill Sauce',
                  }[mainCourse] || 'No main course has been selected'}
                </em>
              </p>
            </>
          ) : (
            <p className="menu-name">
              <b>No main course has been selected</b>
            </p>
          )}
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
    } else if (mainCourse === 'Aubergine Schnitzels') {
      return (
        <div className="menu-details">
          <p className="menu-name">
            <b>
              Amuse Bouche - <i>Wild Mushroom Bruschetta</i>
            </b>
          </p>
          <p class="menu-description">Shimeji, Morels, Oyster Mushroom</p>
          <p className="menu-name">
            <b>Tuscan Panzanella Salad</b>
          </p>
          <p class="menu-description">
            Cherry Tomato, Cucumber, Sourdough, Aged Balsamic
          </p>
          <p className="menu-name">
            <b>Gnocchi Pesto</b>
          </p>
          <p class="menu-description">Tomato, Basil Pesto, Pomodoro Sauce</p>
          <p className="menu-name">
            <b>Lime Granite</b>
          </p>
          <p className="menu-name">
            <b>Aubergine Schnitzels</b>
          </p>
          <p class="menu-description">
            Sweet Potato Mashed, Tomato Cherry, Asparagus, Romesco Sauce
          </p>
          <p className="dessert-section">
            <b>Dessert</b>
          </p>
          <p className="dessert-name">
            <b>Vegan Chocolate Mousse Cake</b>
          </p>
          <p class="menu-description">
            Mixed Berry Sauce, Green Tea Chocolate Soil
          </p>
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
          <p className="no-allergy-note">No allergies confirmed</p>
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
