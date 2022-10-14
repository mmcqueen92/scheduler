import React from "react";
import classNames from "classnames";
import "./DayListItem.scss";

export default function DayListItem(props) {
  const classes = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  })
  if (props.spots === 0) {
    return (
      <li className={classes} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">no spots remaining</h3>
    </li>
    )
  } else if (props.spots === 1) {
    return (
      <li className={classes} onClick={() => props.setDay(props.name)}>
        <h2 className="text--regular">{props.name}</h2> 
        <h3 className="text--light">{props.spots} spot remaining</h3>
      </li>
    );

  } else if (props.spots > 1) {
    return (
      <li className={classes} onClick={() => props.setDay(props.name)}>
        <h2 className="text--regular">{props.name}</h2> 
        <h3 className="text--light">{props.spots} spots remaining</h3>
      </li>
    );
  } else if (!props.spots) {
    return (
      <li className={classes} onClick={() => props.setDay(props.name)}>
        <h2 className="text--regular">{props.name}</h2> 
        <h3 className="text--light"></h3>
      </li>
    );
  }
}
