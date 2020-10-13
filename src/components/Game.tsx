import React from 'react';
import '../AllGame.scss';
import flag from '../icons/redFlag.png'
import stopwatch from '../icons/stopwatch.png'
import Grid from './Grid';

const difficultyLevels: string[] = ["Easy", "Medium"];

interface ComponentState {
  difficultyLevel: string;
  mines: number;
  gridHeight: number;
  gridWidth: number;
  flags: number;
  timeCount: number;
  intervalId: any;
}

export default class Game extends React.Component<{}, ComponentState> {

  state: ComponentState = {
    difficultyLevel: "Easy",
    mines: 10,
    gridHeight: 8,
    gridWidth: 10,
    flags: 10,
    timeCount: 0,
    intervalId: 0
  }

  render() {
    return (
      <div>
        <div className="game">
          <div className="toolbar"> 
            <select onChange={this.handleChange} value={this.state.difficultyLevel} className="select-difficulty">
                {difficultyLevels.map(level => 
                    <option key={level} value={level}>{level}</option>
                )}
            </select>
            <div className="img-wrapper">
              <span>
                <img src={flag} width={30} alt="flag"/>
                {this.state.flags}
              </span>
              <span>
                <img src={stopwatch} width={30} alt="flag"/>
                { ("00" + this.state.timeCount).slice(-3)}
              </span>
            </div>
          </div>
          <Grid 
            mines={this.state.mines} 
            height={this.state.gridHeight} 
            width={this.state.gridWidth}
            updateFlagCount={this.updateFlagCount}
            startCounting={this.startCountingTime}
            stopCountingTime={this.stopCountingTime}
          />
        </div>
      </div>
    );
  }

  private handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let selectedOption = e.target.value;
    if (this.state.difficultyLevel !== selectedOption) {
      clearInterval(this.state.intervalId);
      this.setState(prev => ({...prev, timeCount: 0}))
    }

    let mines: number;  
    let gridHeight: number;
    let gridWidth: number;
    if (selectedOption === difficultyLevels[0]) {
      mines = 10;
      gridHeight = 8;
      gridWidth = 10;
    }
    else if (selectedOption === difficultyLevels[1]) {
      mines = 40;
      gridHeight = 14;
      gridWidth = 18;
    }

    this.setState(prev => ({ ...prev, 
                              difficultyLevel: selectedOption,
                              mines: mines,
                              gridHeight: gridHeight,
                              gridWidth: gridWidth,
                              flags: mines
                            }));
  }

  private updateFlagCount = (markedSquares: number) => this.setState(prev => ({ ...prev, flags: prev.flags - markedSquares}));

  private startCountingTime = () => {
    let intervalId = setInterval(() => { this.setState(prev => ({...prev, timeCount: prev.timeCount + 1}))}, 1000);
    this.setState(prev => ({...prev, intervalId: intervalId}));
  }

  private stopCountingTime = () => {
    clearInterval(this.state.intervalId);
  }

}