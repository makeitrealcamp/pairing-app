import React from "react";

export default props => {
  return (
    <div className="loading-page">
      <img src="../../loading.svg" />
      { props.text ? <p>{props.text}</p> : null }
    </div>
  )
};
