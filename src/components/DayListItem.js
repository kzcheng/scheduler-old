import React from "react";
import classnames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  const formatSpots = function(spots) {
    if (spots === 0) {
      return "no spots remaining";
    } else
      return spots === 1
        ? `${spots} spot remaining`
        : `${spots} spots remaining`;
  };

  console.log(props);

  const dayClass = classnames("day-list__item", {
    "day-list__item--selected": props && props.selected,
    "day-list__item--full": props && props.spots === 0
  });

  return (
    <li
      className={dayClass}
      onClick={() => props && props.setDay && props.setDay(props.name)}
    >
      <h2 className="text--regular">{props && props.name}</h2>
      <h3 className="text--light">{props && formatSpots(props.spots)}</h3>
    </li>
  );
}
