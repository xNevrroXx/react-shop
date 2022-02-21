import React, { Children, Component } from "react";

import { ICard } from "../../../App";
import "./list-pages-cards.scss";

interface IProp {
    elementsAtPage: number,
    newArrPages: string[],
    onChangePage: (numberPageToGo: number) => void,
    onShowMorePages: () => void
}

interface IState {
}

class ListPagesCards extends Component<IProp, IState> {
    constructor(props: IProp) {
        super(props);

        this.state = {
        }
    }

    onChangePage = (e: any): void => {
        this.props.onChangePage(+e.target.childNodes[0].data)
    }

    render() {
        const { newArrPages } = this.props;

        return (
            <footer className="list-pages">
                <nav>
                    <ul>
                        {
                            newArrPages.map( (item: string) => {
                                if(item === "past")
                                    return (
                                        <li key={item}>
                                            <a onClick={this.props.onShowMorePages}>.....</a>
                                        </li>
                                    )
                                return (
                                    <li key={item}>
                                        <a onClick={this.onChangePage}>{item}</a>
                                    </li>
                                )
                            })    
                        }
                    </ul>
                </nav>
            </footer>
        )
    }
}

export default ListPagesCards;