import React from 'react';
import mine from '../icons/mine.png';
import flag from '../icons/redFlag.png';
import { SquareData } from './Grid';

const STATE_HIDDEN = "hidden";
const STATE_MARKED = "marked";

interface ComponentProps {
    mines: number;
    data: SquareData;
    exploded: boolean;
    onLeftClick: (i: number, j: number) => void;
    onRightClick: (i: number, j: number, e: any) => void;
}

export default class Sqaure extends React.Component<ComponentProps, {}> {

    render() {
        let location = this.props.data.id.split(",");
        let row = parseInt(location[0]);
        let column = parseInt(location[1]);
        let medium = this.props.mines === 40;
        let count = this.props.data.count;
        return (
            <div className="sqaure"
                style={{ height: medium ? '30px' : '52px', fontSize: medium ? '18px' : '25px', textAlign: 'center'}}
                onClick={() => this.props.onLeftClick(row, column)}
                onContextMenu={(e) => this.props.onRightClick(row, column, e)}
            >
                {
                    this.props.exploded && this.props.data.isMine ?
                        <img src={mine} width={medium ? "25" : "30"} alt="mine"/>
                        : this.props.data.state === STATE_HIDDEN ?
                            " "
                            : this.props.data.state === STATE_MARKED ?
                                <img src={flag} width={medium ? "25" : "30"} alt="flag"/>
                                : <div style={{ fontSize: medium ? '20px' : '30px', 
                                                color: count !== 0 ? this.getCountColor(count): "#666" }}
                                  >
                                    {
                                        count !== 0 ?
                                        count
                                        : null
                                    }
                                  </div>
                }
            </div>
        );
    }

    private getCountColor = (count: number): string => {
        if(count === 2) {
            return "#2ACD2A";
        }
        else if(count === 3) {
            return "#F39C12";
        }
        else if(count === 4){
            return "#E74C3C";
        }
        else if(count === 5){
            return "#7B241C";
        }
        else if(count === 6) {
            return "#4A235A";
        }
        return "#666";
    }
}