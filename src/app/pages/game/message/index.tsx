import React from 'react';

interface MessageProps {
    turn: boolean;
}

const Message = ({turn}: MessageProps): JSX.Element | null => {
    if (turn) {
        return (
            <div className="alert alert-success">Your turn to make move</div>
        );
    } else {
        return (
            <div className="alert alert-danger">Waiting for opponent to make move</div>
        );
    }
};

export default Message;
