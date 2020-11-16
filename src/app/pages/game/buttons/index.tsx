import React, {useState} from 'react';
import CONFIG from "../../../config";

import './index.css';

interface ButtonsProps {
    addNextMove: (value: number) => void;
    disabled: boolean;
    allowedNumber: number;
}

const Buttons = ({addNextMove, disabled, allowedNumber}: ButtonsProps): JSX.Element => {
    const [blink, setBlink] = useState(false);

    const onButtonClick = (value: number) => {
        if (allowedNumber === value) {
            addNextMove(value);
            return;
        }

        setBlink(true);
        setTimeout(() => {
            setBlink(false);
        }, 2000);
    };

    return (
        <div className="text-white text-center">
            {
                CONFIG.numbers.map((val: number) => (
                    <button
                        className={"rounded-circle btn btn-primary btn-lg m-2" + ((allowedNumber === val && blink) ? ' blink' : '')}
                        key={val} disabled={disabled} onClick={() => onButtonClick(val)}>
                        <span>{val > 0 ? '+' : ''}{val}</span>
                    </button>
                ))
            }
        </div>
    );
};

export default Buttons;
