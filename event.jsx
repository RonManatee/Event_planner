import React, { useState } from "react"; // MUST IMPORT REQUIRED DEPENDENCIES
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice"; // MUST IMPORT REQUIRED DEPENDENCIES
import {incrementQuantity, decrementQuantity } from "./avSlice";
import { toggleMealSelection } from "./mealSlice";
const ConferenceEvent = () => {
    const [showItems, setShowItems] = useState(false);
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const avItems = useSelector((state) => state.av); //initialized add-ons from ./avSlice.js
    const venueItems = useSelector((state) => state.venue); // useSelector() function retrieves venue items from Redux store
    const mealsItmes = useSelector((state) => state.meals);
    const dispatch = useDispatch();
    // it calculates the remaining number of available auditorium halls to three, so the user cannot request more
    const remainingAuditoriumQuantity = 3 - venueItems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity;
   
    
    const handleToggleItems = () => {
        console.log("handleToggleItems called");
        setShowItems(!showItems);
    };
// it defines event handlers like handleAddToCart and handleRemoveFromCart to either increase/decrease quantities
    const handleAddToCart = (index) => { 
        if (venueItems[index].name === "Auditorium Hall (Capacity:200)" && venueItems[index].quantity >= 3) {
          return; 
        }
        dispatch(incrementQuantity(index));
      };
    // this removes from the cart
      const handleRemoveFromCart = (index) => {
        if (venueItems[index].quantity > 0) {
          dispatch(decrementQuantity(index));
        }
      };
    const handleIncrementAvQuantity = (index) => {
        dispatch(incrementAvQuantity(index));
    };

    const handleDecrementAvQuantity = (index) => {
        dispatch(decrementAvQuantity(index));
    };

    const handleMealSelection = (index) => {
        const item = mealsItems[index];
        if (item.selected && itemtype === "mealForPeople") {
            //ensure numberOfPeople is set before toggling selection
            const newNumberOfPeople = item.selected ? numberOfPeople : 0;
            dispatch(toggleMealSelection(index, newNumberOfPeople));
        } else {
            dispatch(toggleMealSelection(index));
        }
       
    };

    const getItemsFromTotalCost = () => {
        const items = [];
        venueItems.forEach((item) => {
            if (item.quantity > 0) {
                items.push({ ...item, type: "venue"});
            }
        });
        avItems.forEach((item) => {
            if (item.quantity > 0 && !items.some((i) => i.name === item.name && i.type === "av")
                ){ items.push({ ...item, type: "av"});
                 }
        });
        mealsItems.forEach((item) => {
            if (item.selected) {
                const itemForDisplay = { ...item, type: "meals" };
                if (item.numberOfPeople) {
                    itemForDisplay.numberOfPeople = numberOfPeople;
                }
                items.push(itemsForDisplay);
            }
        });
        return items;
    };

    const items = getItemsFromTotalCost();

    const avTotalCost= calculateTotalCost("av");

    const mealsTotalCost = calculateTotalCost("meals");

    const totalCosts = {
        venue: venueTotalCost,
        av: avTotalCost,
        meals: mealsTotalCost,
    };

    const ItemsDisplay = ({ items }) => {
        console.log(items);
        return <>
        <div className="display_box1">
            {items.length === 0 && <p>No items selected</p>}
            <table className="tabel_item_data">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Unit Cost</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
            <tr key={index}>
                <td>{item.name}</td>
                <td>${item.cost}</td>
                <td>
                    {item.type === "meals" || item.numberOfPeople
                        ? ` For ${numberOfPeople} people`
                        : item.quantity}
                </td>
                <td>
                    {item.type === "meals" || item.numberOfPeople
                        ? `${item.cost * numberOfPeople}`
                        : `${item.cost * item.quantity}`}
                </td>
            </tr>
            ))}
                </tbody>
            </table>
        </div>
        </>

    };
    // when buttons are used to add or subtract, system should calculate the cost for all selected rooms
    const calculateTotalCost = (section) => {
        let totalCost = 0; //starts at 0
        if (section === "venue") {
          venueItems.forEach((item) => { //array represents an item with properties "cost" and "quantity"
              // ".forEach" iterates over each item in the "venueItems" array. for each item, it multiplies "item.cost"
              // by "item.quantity" and adds results to "total cost"
            totalCost += item.cost * item.quantity; //takes one string, added to item then multiplied by amount to get total
          });
        } else if (section == "av") {
            avItems.forEach((item) => {
                totalCost += item.cost * item.quantity;
            });
        } else if (section === "meals") {
            mealsItems.forEach((item) => {
                if (item.selected) {
                    totalCost += item.cost * numberOfPeople;
                }
            });
            
        return totalCost; // loop will run and retun "totalCost".
      }; // calculateTotalCost is called with "venue" argument, and calculates total cost for items in "venue" section
    // result is stored in constant "venueTotalCost" [Continued at line 152]
    const venueTotalCost = calculateTotalCost("venue");

    const navigateToProducts = (idType) => {
        if (idType == '#venue' || idType == '#addons' || idType == '#meals') {
          if (showItems) { // Check if showItems is false
            setShowItems(!showItems); // Toggle showItems to true only if it's currently false
          }
        }
      }

    return (
        <>
            <navbar className="navbar_event_conference">
                <div className="company_logo">Conference Expense Planner</div>
                <div className="left_navbar">
                    <div className="nav_links">
                        <a href="#venue" onClick={() => navigateToProducts("#venue")} >Venue</a>
                        <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
                        <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
                    </div>
                    <button className="details_button" onClick={() => setShowItems(!showItems)}>
                        Show Details
                    </button>
                </div>
            </navbar>
            <div className="main_container">
                {!showItems
                    ?
                    (
                        <div className="items-information">
                             <div id="venue" className="venue_container container_main">
        <div className="text">
 
          <h1>Venue Room Selection</h1>
        </div>
        <div className="venue_selection">
          {venueItems.map((item, index) => (
            <div className="venue_main" key={index}>
              <div className="img">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="text">{item.name}</div>
              <div>${item.cost}</div>
     <div className="button_container">
        {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (

          <>
          <button
            className={venueItems[index].quantity === 0 ? "btn-warning btn-disabled" : "btn-minus btn-warning"}
            onClick={() => handleRemoveFromCart(index)}
          >
            &#8211;
          </button>
          <span className="selected_count">
            {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
          </span>
          <button
            className={remainingAuditoriumQuantity === 0? "btn-success btn-disabled" : "btn-success btn-plus"}
            onClick={() => handleAddToCart(index)}
          >
            &#43;
          </button>
        </>
        ) : (
          <div className="button_container">
           <button
              className={venueItems[index].quantity ===0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
              onClick={() => handleRemoveFromCart(index)}
            >
               &#8211;
            </button>
            <span className="selected_count">
              {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
            </span>
            <button
              className={venueItems[index].quantity === 10 ? " btn-success btn-disabled" : "btn-success btn-plus"}
              onClick={() => handleAddToCart(index)}
            >
             &#43;
            </button>
            
            
          </div>
        )}
      </div>
            </div>
          ))}
        </div>
         {/* component displayes the total cost of all selected venue items*/}
        <div className="total_cost">Total Cost: ${venueTotalCost}</div>
      </div>

                            {/*Necessary Add-ons*/}
                            <div id="addons" className="venue_container container_main">


                                <div className="text">

                                    <h1> Add-ons Selection</h1>

                                </div>
                                <div className="addons_selection">

                                </div>
                                <div className="total_cost">Total Cost:</div>

                            </div>

                            {/* Meal Section */}

                            <div id="meals" className="venue_container container_main">

                                <div className="text">

                                    <h1>Meals Selection</h1>
                                </div>

                                <div className="input-container venue_selection">
                                    <label htmlFor="numberOfPeople"><h3>Number of People:</h3></label>
                                    <input type="number" className="input_box5" id="numberOfPeople" value={numberOfPeople}
                                        onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                                        min="1"
                                        />
                                    </div>
                        <div className="meal_selection">
                                    {maslsItems.map((item, index) => (
                            <div className="meal_item" key={index} style={{padding: 15}}>
                                    <div className="inner">
                                        <input type="checkbox" id={ `meal_${index}` }
                                            checked={item.selected}
                                            onChange={() => handleMealSelection(index)}
                                            />
                                        <label htmlFor={ `meal_${index}` }> {item.name} </label>
                                    </div>
                                <div className="meal_cost">${item.cost}</div>
                                <div className="total_cost">Total Cost: {mealsTotalCost}</div>
                            </div>
                        ))}
                        </div>
                                <div className="total_cost">Total Cost: </div>


                          
                    ) : (
                        <div className="total_amount_detail">
                            <TotalCost totalCosts={totalCosts} handleClick={handleToggleItems} ItemsDisplay={() => <ItemsDisplay items={items} />} />
                        </div>
                    )
                }
                {avItems.map((item, index) => (// map function to iterate over an array called avItems
            <div className="av_data venue_main" key={index}>
                <div className="img">
                    <img src={item.img} alt={item.name} />
                </div>
                    <div className="text"> {item.name} </div>
                    <div> ${item.name} </div>
                <div className="addons_btn">
                    <button className="btn-Warning" onClick={() => handleDecrementAvQuantity(index)}> &ndash; </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button className="btn-success" onClick={() => handleIncrementAvQuantity(index)}> &#43; </button>
                </div>
                <div className="total_cost">Total Cost: {avTotalCost}</div>
            </div>
        ))}
                
        </>

    );
};

export default ConferenceEvent;
