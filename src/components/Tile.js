import '../styles/Tile.css'

const Tile = ({ tile, onClick }) => {

  const typeToImage = (type) => {
    switch (type) {
      default:
        return null;
      case 'w-pawn':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Chess_plt45.svg/1280px-Chess_plt45.svg.png';
      case 'w-rook':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/1280px-Chess_rlt45.svg.png';
      case 'w-knight':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/1280px-Chess_nlt45.svg.png';
      case 'w-king':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chess_klt45.svg/1280px-Chess_klt45.svg.png';
      case 'w-queen':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chess_qlt45.svg/1280px-Chess_qlt45.svg.png';
      case 'w-bishop':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/1280px-Chess_blt45.svg.png';
      case 'b-pawn':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Chess_hdt45.svg/1280px-Chess_hdt45.svg.png';
      case 'b-rook':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Chess_mdt45.svg/1280px-Chess_mdt45.svg.png';
      case 'b-knight':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Chess_Ndt45.svg/1280px-Chess_Ndt45.svg.png';
      case 'b-bishop':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Chess_Bdt45.svg/1280px-Chess_Bdt45.svg.png';
      case 'b-king':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Chess_fdt45.svg/1280px-Chess_fdt45.svg.png';
      case 'b-queen':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Chess_gdt45.svg/1280px-Chess_gdt45.svg.png';
      }
  }
  let selected = '';
  if (tile.selected)
    selected = 'selected';
  let tileImage;
  if (tile.type !== 'empty')
    tileImage = <img className='Tile-image' src={typeToImage(tile.type)} alt={tile.type} />;
  return <div onClick={event => onClick(event, tile)} className={`Tile ${tile.color} ${selected}`}>
    {tileImage}
  </div>
}

export default Tile;