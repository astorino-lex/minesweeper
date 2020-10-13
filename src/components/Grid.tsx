import React from 'react';
import Sqaure from './Sqaure';
import '../AllGame.scss';
import replay from '../icons/replay.png';

const STATE_HIDDEN = "hidden";
const STATE_SHOWN = "shown";
const STATE_MARKED = "marked";

interface ComponentProps {
    height: number;
    width: number;
    mines: number;
    updateFlagCount: (markedSquares: number) => void;
    startCounting: () => void;
    stopCountingTime: () => void;
}

interface ComponentState {
    uncoveredSquares: number;
    gridData: SquareData[][];
    exploded: boolean;
    markedSqaures: number;
}

export interface SquareData {
    id: string;
    isMine: boolean;
    state: string;
    count: number;
}

export default class Grid extends React.Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);
        this.state = {
            uncoveredSquares: 0,
            gridData: this.generateGridData(),
            exploded: false,
            markedSqaures: 0
        }
    }

    shouldComponentUpdate(nextProps: ComponentProps, nextState: ComponentState) {
        if (nextProps.mines !== this.props.mines) {
            this.setState(prev => 
                ({...prev, 
                    gridData: this.generateGridData(),
                    exploded: false,
                    markedSqaures: 0,
                    uncoveredSquares: 0
            }));
            return false;
        }
        return true;
    }

    render() {
       let winner = !this.state.exploded && this.state.uncoveredSquares === this.props.height * this.props.width - this.props.mines; 
       let loser = this.state.exploded;
        return(
            <div style={{position: "relative"}}>
                {  winner || loser ?
                    <div className="finish-message">
                        <div>
                            { winner ?
                                "You Won!"
                                : "You Lost!"
                            }
                        </div>
                        <div className="play-again" onClick={() => window.location.reload()}>
                            Play again
                            <img src={replay} width={35} alt="replay" />
                        </div>
                    </div>    
                    : null   
                }
                <table className="grid" style={{pointerEvents: this.state.exploded ? 'none' : 'auto'}}>
                    <tbody>
                        {this.createGrid()}
                    </tbody>
                </table>
            </div>
            
        );

    }

    private createGrid = () => {
        let rows = [];
        for (var i = 0; i < this.props.height; i++) {
            let columns = [];
            for (var j = 0; j < this.props.width; j++) {
                columns.push(<td key={`${i},${j}`} 
                                style={{backgroundColor: this.getColor(i, j)}} >
                                <Sqaure 
                                    mines={this.props.mines}
                                    exploded={this.state.exploded}
                                    data={this.state.gridData[i][j]} 
                                    onLeftClick={this.handleLeftClick}
                                    onRightClick={this.handleRightClick}
                                />
                            </td>)
            }
            rows.push(<tr key={i}>{columns}</tr>)
        }
        return rows;
    }

    private generateGridData = (): SquareData[][] => {
        let data: SquareData[][] = [];

        for (let i = 0; i < this.props.height; i++) {
           data.push([])
            for (let j = 0; j < this.props.width; j++) {
                data[i][j] = {
                    id: `${i},${j}`,
                    count: 0,
                    state: STATE_HIDDEN,
                    isMine: false
                };
            }
        }
        return data;
    }

    private handleRightClick = (row: number, col: number, e: MouseEvent) => {
        e.preventDefault();
        if(!this.isValidCoordinate(row,col)) return false;

        // if cell is shown, do nothing
        if(this.state.gridData[row][col].state === STATE_SHOWN) return false;

        let updatedGridData: SquareData[][] = this.state.gridData;

        updatedGridData[row][col].state = updatedGridData[row][col].state === STATE_MARKED ? STATE_HIDDEN : STATE_MARKED;

        this.setState(prev => 
            ({ ...prev,
                markedSqaures: updatedGridData[row][col].state === STATE_MARKED ? prev.markedSqaures + 1 : prev.markedSqaures - 1,
                gridData: updatedGridData                          
        }),
            () => this.props.updateFlagCount(this.state.markedSqaures)
        );

        return false;
    }

    private handleLeftClick = (row: number, col: number) => {
        if(!this.isValidCoordinate(row,col)) 
            return false;

        //first move
        if (this.state.uncoveredSquares === 0) {
            this.generateMines(row, col);
            this.props.startCounting();
        }

        //if sqaure is already revealed or marked, do nothing
        if(this.state.gridData[row][col].state !== STATE_HIDDEN) 
            return false;
        
        let updatedGridData: SquareData[][] = this.state.gridData;
    
        this.reveal(row, col, updatedGridData);

        this.setState(prev => 
            ({...prev,
                gridData: updatedGridData,
        }));

        if(this.state.gridData[row][col].isMine) {
            this.setState(prev => ({...prev, exploded: true}));
            this.props.stopCountingTime();
        }
    }

    private reveal = (r: number, c: number, updatedGridData: SquareData[][]) => {
                
        if(!this.isValidCoordinate(r, c)) return;
        
        //if already shown, return
        if( this.state.gridData[r][c].state === STATE_SHOWN) return;

        updatedGridData[r][c].state = STATE_SHOWN;
        this.setState(prev => ({...prev, uncoveredSquares: prev.uncoveredSquares + 1}))

        //if neighbours have mines, return
        if( this.state.gridData[r][c].count !== 0) return;
       
        this.reveal(r-1, c-1, updatedGridData);
        this.reveal(r-1, c, updatedGridData);
        this.reveal(r-1, c+1, updatedGridData);
        this.reveal(r, c-1, updatedGridData);
        this.reveal(r, c+1, updatedGridData);
        this.reveal(r+1, c-1, updatedGridData);
        this.reveal(r+1, c, updatedGridData);
        this.reveal(r+1, c+1, updatedGridData);
    }

    private generateMines = (row: number, col: number) => {
        let newGridData: SquareData[][] = this.state.gridData;

        //generate coordinated that are allowed to have mines
        let allowedCoorindates = [];

        for(let r = 0 ; r < this.props.height ; r ++ ) {
            for( let c = 0 ; c < this.props.width ; c ++ ) {
              if(Math.abs(row-r) > 2 || Math.abs(col-c) > 2) {
                allowedCoorindates.push([r,c]);
              }
            }
        }

        //randomly decide mine coordinates from allowed coordinates
        let totalMines = Math.min(this.props.mines, allowedCoorindates.length);
        for(let i = 0 ; i < totalMines ; i ++ ) {
            let j = this.randomNumber(i, allowedCoorindates.length-1);
            [allowedCoorindates[i], allowedCoorindates[j]] = [allowedCoorindates[j], allowedCoorindates[i]];
            let [r,c] = allowedCoorindates[i];
            newGridData[r][c].isMine = true;
        }

        //clear any previously marked sqaures and update counts
        for(let r = 0 ; r < this.props.height ; r ++ ) {
            for( let c = 0 ; c < this.props.width ; c ++ ) {
                if(newGridData[r][c].state === STATE_MARKED) {
                    newGridData[r][c].state = STATE_HIDDEN;
                }
                newGridData[r][c].count = this.count(r,c, newGridData);
            }
        }

        this.setState(prev => ({...prev, gridData: newGridData, markedSqaures: 0 }),
            () => this.props.updateFlagCount(this.state.markedSqaures)
        );
    }

    private randomNumber = (min: number, max: number) => {
        [min,max] = [Math.ceil(min), Math.floor(max)]
        return min + Math.floor(Math.random() * (max - min + 1));
    }
    
    private count = (row: number, col: number, gridData: SquareData[][]) => {
        const c = (r: number, c: number) =>
             (this.isValidCoordinate(r,c) && gridData[r][c].isMine ? 1 : 0);
        let res = 0;
        for( let dr = -1 ; dr <= 1 ; dr ++ ) {
          for( let dc = -1 ; dc <= 1 ; dc ++ ) {
            res += c(row+dr,col+dc);
          }
        }
        return res;
    }

    private isValidCoordinate = (row: number, col: number) => {
        return row >= 0 && row < this.props.height && col >= 0 && col < this.props.width;
    }

    private getColor = (row: number, col: number): string => {
        let color1 = "#99D599";
        let color2 = "#83D183";

        if(this.state.gridData[row][col].state === STATE_SHOWN) {
            color1 = "#E4DEB8";
            color2 = "#E2DAAC"
        }

        if(this.state.gridData[row][col].isMine && this.state.exploded) {
            return "#D34949";
        }

        if(!this.isEven(row)) {
           return this.isEven(col) ? color1 : color2 ;
        }
        else {
           return this.isEven(col) ? color2 : color1;
        }
    }

    private isEven = (value: number) => {
        if (value%2 === 0)
            return true;
        else
            return false;
    }

}
