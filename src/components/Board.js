import Tile from "./Tile";
import '../styles/Board.css'
import { useState } from "react";

const Board = ({ gameBoard, setGameBoard, round, setRound, setRoundCount, history, setHistory }) => {
  const [selected, setSelected] = useState(null);

  const updateTileType = (id, newData) => {
    setGameBoard(prevBoard => {
      const newState = prevBoard.map(obj => {
        if (obj.key === id) {
          return { ...obj, type: newData }
        }
        return obj;
      });
      return newState;
    })
  }

  const updateTileMoved = (id, newData) => {
    setGameBoard(prevBoard => {
      const newState = prevBoard.map(obj => {
        if (obj.key === id) {
          return { ...obj, moved: newData }
        }
        return obj;
      });
      return newState;
    })
  }

  const selectTile = (e, tile) => {
    // select
    if (tile.type !== 'empty' && tile.type.split('-')[0] === round) {
      setSelected(tile)
      tile.selected = true;
      if (selected)
        selected.selected = false;
    }
    // attack/deselect
    else if (selected) {
      makeAttack(selected, tile)
      selected.selected = false;
      setSelected(null)
    }
  }

  const roundSwitch = () => {
    if (round === 'w')
      setRound('b')
    else
      setRound('w')
    setHistory([...history, gameBoard])
  }

  const makeAttack = (tile1, tile2) => {
    // castling
    let castlingNum = castling(tile1, tile2);
    if (castlingNum) {
      updateTileType(tile2.key, tile1.type);
      updateTileType(tile1.key, 'empty');
      if (castlingNum === 1) {
        updateTileType((tile1.key - 1), 'b-rook')
        updateTileType(0, 'empty')
      }
      else if (castlingNum === 2) {
        updateTileType((tile1.key + 1), 'b-rook')
        updateTileType(7, 'empty')
      }
      else if (castlingNum === 3) {
        updateTileType((tile1.key - 1), 'w-rook')
        updateTileType(56, 'empty')
      }
      else if (castlingNum === 4) {
        updateTileType((tile1.key + 1), 'w-rook')
        updateTileType(63, 'empty')
      }
      updateTileMoved(tile1.key, true)
      updateTileMoved(tile2.key, true)
      roundSwitch();
      setRoundCount(roundCount => roundCount += 1);
    }
    // en passant
    else if (enPassant(tile1, tile2)) {
      updateTileType(tile2.key, tile1.type)
      updateTileType(tile1.key, 'empty')
      if (tile1.type === 'w-pawn')
        updateTileType((tile2.key + 8), 'empty')
      if (tile1.type === 'b-pawn')
        updateTileType((tile2.key - 8), 'empty')
    }
    // normal move
    else if (checkMoveValidity(tile1, tile2)) {
      pawnPromotion(tile1, tile2);
      updateTileType(tile2.key, tile1.type);
      updateTileType(tile1.key, 'empty');
      updateTileMoved(tile1.key, true)
      updateTileMoved(tile2.key, true)
      roundSwitch();
      setRoundCount(roundCount => roundCount += 1);
    }
  }

  const moveDirection = (origin, destination) => {
    // Horizontal
    if ((origin - origin % 8) <= destination && destination < origin + (8 - origin % 8))
      return 'horizontal';
    // Vertical
    if (origin % 8 === destination % 8)
      return 'vertical';
    // Diagonal
    if (origin % 9 === destination % 9 || origin % 7 === destination % 7)
      return 'diagonal';
    // Knight
    if (origin - destination === Math.abs(17) || Math.abs(10))
      return 'knight';
    // invalid
    return 'invalid';
  }

  const typeConvert = (type) => {
    let words = type.split('-')
    return words[1];
  }

  const checkMoveValidity = (tile1, tile2) => {
    let direction = moveDirection(tile1.key, tile2.key);
    let type = typeConvert(tile1.type);

    // make distance absolute as long as its not a pawn
    let distance = Math.abs(tile1.key - tile2.key);
    if (tile1.type === 'w-pawn')
      distance = tile1.key - tile2.key;
    if (tile1.type === 'b-pawn')
      distance = tile2.key - tile1.key;

    if (direction === 'horizontal') {
      if (type === 'rook' || type === 'queen')
        return true;
      if (type === 'king')
        if (distance === 1)
          return true;
    }
    if (direction === 'vertical') {
      if (type === 'rook' || type === 'queen')
        return true;
      if (type === 'king' || type === 'pawn')
        if (distance === 8)
          return true;
      if (distance === 16 && type === 'pawn' && !tile1.moved)
        return true;
    }
    if (direction === 'diagonal') {
      if (type === 'bishop' || type === 'queen')
        return true;
      if (type === 'king' || (type === 'pawn' && checkPawnDiagonal(tile1, tile2))) {
        if (distance === 7 || 9) {
          return true;
        }
      }
    }
    if (direction === 'knight' && type === 'knight')
      return true;

    return false
  }

  const enPassant = (tile1, tile2) => {
    // white attacks black
    if (tile1.type === 'w-pawn') {
      // check for adjacent pawn
      if (gameBoard[tile2.key + 8].type === 'b-pawn') {
        // check if last move was double-jump
        if (history[history.length - 2][tile2.key - 8].type === 'b-pawn') {
          if (gameBoard[tile2.key - 8].type === 'empty') {
            return true;
          }
        }
      }

    }

    // black attacks white
    if (tile1.type === 'b-pawn') {
      // check for adjacent pawn
      if (gameBoard[tile2.key - 8].type === 'w-pawn') {
        // check if last move was double-jump
        if (history[history.length - 2][tile2.key + 8].type === 'w-pawn' &&
          (gameBoard[tile2.key + 8].type === 'empty')) {
          return true;
        }

      }

    }
    return false;
  }

  const castling = (tile1, tile2) => {
    const emptyTiles = (num1, num2) => {
      for (let i = num1; i < num2; i++) {
        if (gameBoard[i].type !== 'empty') {
          return false;
        }
      }
      return true;
    }

    let castlingTiles = [2, 6, 58, 62];
    if (!tile1.moved && castlingTiles.includes(tile2.key)) {
      if (typeConvert(tile1.type) === 'king' && tile2.type === 'empty') {
        if (tile2.key === 2 && emptyTiles(1, 4))
          if (gameBoard[0].type === 'b-rook' && !gameBoard[0].moved)
            return 1;
        if (tile2.key === 6 && emptyTiles(5, 7))
          if (gameBoard[7].type === 'b-rook' && !gameBoard[7].moved)
            return 2;
        if (tile2.key === 58 && emptyTiles(57, 60))
          if (gameBoard[56].type === 'w-rook' && !gameBoard[56].moved)
            return 3;
        if (tile2.key === 62 && emptyTiles(61, 63))
          if (gameBoard[63].type === 'w-rook' && !gameBoard[63].moved)
            return 4;
      }
    }
    return 0;
  }

  const pawnPromotion = (tile1, tile2) => {
    if (typeConvert(tile1.type) === 'pawn')
      if (tile2.key < 8 || tile2.key > 55)
        tile1.type = `w-${prompt('What would you like to promote to?') || 'queen'}`;
  }

  const checkPawnDiagonal = (tile1, tile2) => {
    if (tile2.type === 'empty')
      return false;
    if (tile1.type === 'w-pawn') {
      if (tile2.key > tile1.key) {
        return false;
      }
    }
    if (tile1.type === 'b-pawn') {
      if (tile2.key < tile1.key) {
        return false;
      }
    }
    return true;
  };

  return (
    <div
      className="Board">
      {gameBoard.map(tile => {
        return (
          <Tile
            key={tile.key}
            tile={tile}
            onClick={selectTile} />
        )
      }
      )}
    </div>
  )
}

export default Board;