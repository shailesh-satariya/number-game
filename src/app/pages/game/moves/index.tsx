import React from 'react';

import './index.css';
import {FIRST_PLAYER, SECOND_PLAYER} from "../../../constants";
import {historyItem} from "../../../types";

interface MovesProps {
    player: number;
    history: historyItem[];
}

class Moves extends React.Component<MovesProps> {
    renderMove = (item: historyItem, index: number): JSX.Element => {
        const {player, history} = this.props;
        const even: boolean = (index % 2 === 0);
        const me: boolean = (!even && player === SECOND_PLAYER) || (even && player === FIRST_PLAYER);
        const prevItem: historyItem | null = index > 0 ? history[index - 1] : null;

        return (
            <div key={index} className={'move-item d-flex ' + (me ? 'me text-right' : 'you text-left')}>
                <div
                    className={"avatar rounded-circle d-flex justify-content-center align-items-center" + (me ? ' bg-info' : ' bg-primary')}>
                    {me ? '👤' : '👤'}
                </div>
                <div className="flex-grow-1">
                    {index !== 0 &&
                    (<div className="rounded-circle bg-primary mr-2 ml-2 mb-2 text-white text-center move-number">
                        <div
                            className="d-flex justify-content-center align-items-center h-100">{prevItem && prevItem.allowedNumber}</div>
                    </div>)}
                    {
                        index !== 0 && (
                            <div className="p-2 mb-2"><span
                                className="bg-light p-2 border">[{prevItem && prevItem.allowedNumber} + {prevItem && prevItem.value}) / 3] = {item.value}</span>
                            </div>
                        )
                    }
                    <div className="p-2"><span className="bg-light p-2 border">{item.value}</span></div>
                </div>
            </div>
        );
    };

    render(): JSX.Element {
        const {history} = this.props;
        return (
            <div className="moves p-2">
                {
                    history && history.length && history.map((item: historyItem, i: number) => (
                        this.renderMove(item, i)
                    ))
                }
            </div>
        )
    }
}

export default Moves;
