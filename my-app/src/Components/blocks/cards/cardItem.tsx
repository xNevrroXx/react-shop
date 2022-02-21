import { ICard } from "../../../App"
import { Button} from "@mui/material";

import "./card.scss";
import { Component } from "react";

interface IProp {
    card: ICard,
    onDelete: () => void,
    onZoomImage: () => void
}

class CardItem extends Component<IProp> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const {card, onDelete, onZoomImage} = this.props;

        return (
            <div className="card">
                <div className="card__wrapper-image">
                    <img className="card__image" 
                        src={card.thumbnailUrl} 
                        alt="image"
                        onClick={onZoomImage} 
                    />
                </div>
                
                <div className="card__wrapper-title">
                    <h6 className="card__title">{card.title}</h6>
                </div>

                <div className="card__wrapper-lower">
                    <span className="card__description">
                        Album num: {card.albumId}
                    </span>
                    <Button 
                        fullWidth
                        variant="outlined"
                        onClick={onDelete}
                    >   
                        Delete Item
                    </Button>
                </div>
            </div>
        )
    }
}

export default CardItem;