import  { Command } from '@colyseus/command'
import ITicTacToeState from '../../types/ITicTacToeState';

export default class NextTurnCommand extends Command<ITicTacToeState> 
{
    execute(){
        const activePlayer = this.room.state.activePlayer
        
        this.room.state.activePlayer = activePlayer === 0 ? 1 : 0;
    }    
}