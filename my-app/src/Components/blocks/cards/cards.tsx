import { Fragment, Component } from "react";
import getData from "../../services/services";

import { ICard } from "../../../App";
import CardItem from "./cardItem";

import "./cards.scss";

interface IProps {
    cardsArr: ICard[],
    page: number,
    elementsAtPage: number,
    onDelete: (id: number) => void,
    onZoomImage: (url: string) => void
}

class Cards extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    

    render() {
        const {cardsArr, page, elementsAtPage, onDelete, onZoomImage} = this.props;
        const needData = cardsArr.slice((page-1)*elementsAtPage, (page-1)*elementsAtPage+elementsAtPage);

        return (
            <div className="wrapper-cards">
                {needData.map( (card: ICard) => 
                    <CardItem
                        key={card.id} 
                        card={card}
                        onDelete={() => onDelete(card.id)}
                        onZoomImage={() => onZoomImage(card.url)}
                    />
                )}
            </div>
        ) 
    }
} 

export default Cards;