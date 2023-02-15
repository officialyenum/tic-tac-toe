import  { Command } from '@colyseus/command'
import { Client } from 'colyseus.js';
import ITicTacToeState from '../../types/ITicTacToeState';
import NextTurnCommand from './NextTurnCommand';

type Payload = {

}

const wins = [
    [{ row: 0, col: 0},{ row: 0, col: 1},{ row: 0, col: 2}],
    [{ row: 1, col: 0},{ row: 1, col: 1},{ row: 1, col: 2}],
    [{ row: 2, col: 0},{ row: 2, col: 1},{ row: 2, col: 2}],

    [{ row: 0, col: 0},{ row: 1, col: 0},{ row: 2, col: 0}],
    [{ row: 0, col: 1},{ row: 1, col: 1},{ row: 2, col: 1}],
    [{ row: 0, col: 2},{ row: 1, col: 2},{ row: 2, col: 2}],

    [{ row: 0, col: 0},{ row: 1, col: 1},{ row: 2, col: 2}],
    [{ row: 0, col: 2},{ row: 1, col: 1},{ row: 2, col: 0}],
]

export default class CheckWinnerCommand extends Command<ITicTacToeState, Payload> 
{
    private determineWin()
    {
        for (let i = 0; i < wins.length; i++) {
            const win = wins[i];
            for (let j = 0; j < win.length; j++) {
                const cell = win[j];
                
            }
            
        }
        return  false;
    }

    execute(){
        const win  = this.determineWin();
        if (win) {
            //TODO: SET  WINNER PLAYER ON  STATE
        }else{
            return [
                new NextTurnCommand()
            ]
        }
    }    
}