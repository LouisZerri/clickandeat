import * as React from "react";
import logo from "../assets/food.png"

const Title: React.FC = () => {
    return (
        <h3 className="display-4 text-center d-flex justify-content-center align-items-center gap-3 mt-5"><img src={logo} alt="Logo"/>Restaurant App</h3>
    )
}

export default Title;