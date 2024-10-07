import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const CustomTooltip = (props) => {
    return (
        <OverlayTrigger 
            // placement="top"
            overlay={
                <Tooltip id="tooltip-top">
                    <span className=" text-white">{props.tooltipData}</span>
                </Tooltip>
            }
        >
            <span>{props.children}</span>
        </OverlayTrigger>
    );
};

export default CustomTooltip;