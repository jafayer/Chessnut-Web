# TODO:
* [x] Write readme
* [] Configure redux store(s)
* [] Create more consistent design language/themeing solution
  * Probably have to suck it up and use styled components or something
* [] Implement play history with lichess-like navigation
* [] Implement wait for possible next move if exists
  * determine if piece moved could advance one or more squares further in the same direction, and wait to register move for 200ms if so
* [] Implement local stockfish/bot playthrough
* [] Implement play clock w/ increment options
* [] Implement win condition & end-of-game state/functionality
  * probably after a game switch the game indicator to a "game over" indicator and display options in sidebar for: 
    - New game
    - Export game/copy PGN
    - Open game on lichess
* [] Implement alert method for notifications
* [] Implement timeout handling for board events
  * if no communication from board after ~3 seconds, switch status indicator to error and flash a notif directing user to power cycle their board
* [] Implement local storage endpoints for
  * [] settings
  * [] games
* [] Lichess:
  * [] Implement login with persistent connection via cookies
  * [] Implement play with bots on Lichess functionality (challenges/ai -> board/board move)
  * [] Implement play with friends on Lichess functionality (challenges -> board/board move)
  * [] Implement play randos on Lichess functionality (seek API)
  * [] Build UI to display information from Lichess
* Lichess puzzles
  * [] Implement "set up puzzle by ID" feature
  * [] Implement "set up daily puzzle" feature
  * [] 