import React, { Children, Component } from "react";

import { ICard } from "../../../App";

import "./list-pages-cards.scss";

interface IProp {
    data: ICard[],
    elementsAtPage: number,
    onChangePage: (numberPageToGo: number) => void
}

class ListPagesCards extends Component<IProp> {
    constructor(props: IProp) {
        super(props);

        this.state = {

        }
    }

    getArrNumbers = (): string[] => {
        const {data, elementsAtPage} = this.props;

        const countPages: number = data.length / elementsAtPage;
        let arrPagesStr: string[] = [];

        for(let i=1; i<=countPages; i++) {
            arrPagesStr.push(String(i));
        }

        return arrPagesStr;
    }

    onChangePage = (e: any) => {
        this.props.onChangePage(+e.target.childNodes[0].data)
    }

    render() {
        const {onChangePage} = this.props;
        const arrPagesStr: string[] = this.getArrNumbers();
        // const visibleListPages: string = 

        return (
            <footer className="list-pages">
                <ul>
                    {
                        arrPagesStr.map( (number: string) => {
                            return (
                                <li key={number}>
                                    <a onClick={this.onChangePage}>{number}</a>
                                </li>
                            )
                        })
                    }
                </ul>
            </footer>
        )
    }
}

export default ListPagesCards;