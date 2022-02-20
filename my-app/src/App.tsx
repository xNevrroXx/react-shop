import { Fragment, Component, useState } from 'react';
import { Container, Box } from '@mui/material';

//// my modules ////
import getData from './Components/services/services';
import Header from "./Components/blocks/header/header";
import SearchPanel from './Components/blocks/search-panel/search-panel';
import Cards from './Components/blocks/cards/cards';
import ZoomedImageModal from './Components/blocks/zoomed-image/zoomed-image';
import ListPagesCards from './Components/blocks/listPagesCards/list-pages-cards';

import "./app.scss";

export interface ICard {
	albumId: number,
	id: number,
	title: string,
	url: string,
	thumbnailUrl: string,
} 




interface IProps {
}

interface IState {
	data: ICard[],
	visibleData: ICard[],
	albumsOptions: string[],
	term: string,
	modalUrl: string,
	zoomed: boolean,

	elementsAtPage: number,
	numberPageToGo: number,
	allPagesArr: string[],
	newArrPages: string[],
	maxPages: number
}

class App extends Component<IProps, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			data: [],
			visibleData: [],
			elementsAtPage: 16,
			numberPageToGo: 1,
			albumsOptions: [],
			term: "All",
			modalUrl: "",
			zoomed: false,
			allPagesArr: [],
			newArrPages: [],
			maxPages: 35
		}
	}

	componentDidMount() {
		getData("http://jsonplaceholder.typicode.com/photos")
		.then( (data) => {
			// data.sort( (a: ICard, b: ICard) => { //сортировка элементов по ID
			// 	if(a.id > b.id)
			// 		return 1;
			// 	else if(b.id > a.id)
			// 		return -1;

			// 	return 0;
			// })
			this.setState({data});

			this.getAlbumsOptions();

			this.getData(this.state.data, this.state.term);
			this.getAllPages(this.state.data);
			this.getListPages(this.state.allPagesArr);
		})
	}

	onUpdateSearch = (term: string) => {
		this.setState({term, numberPageToGo: 1});
		this.getData(this.state.data, term);
	}

	getData = (data: ICard[], term: string=""): void => {
		let visibleData: ICard[] = [];

		if(term !== "All" && term !== "")
			visibleData = data.filter( (card: ICard) => card.albumId == +term)
		else if(term == "All") {
			visibleData = data;
		}
		else
			visibleData = data;

		this.getAllPages(visibleData);
		this.setState({visibleData});
	}

	onDelete = (id: number) => {
		new Promise((resolve, reject) => {
			resolve(
				this.setState( ({data}) => {
					return {
						data: data.filter(card => card.id !== id)
					}
				})
		 	)
		})
		.then(() => {
			this.getAlbumsOptions();
			}
		)
		.then(() => {
			this.getData(this.state.data, this.state.term);
			}
		)		
	}

	getAlbumsOptions = (): void => {
		const {data} = this.state;
		let numberAlbumsArr: string[] = ["All"];

		data.forEach( (card: ICard) => {
			let wasCoincidence: boolean = false;
			let lastNumber: number = card.albumId;

			numberAlbumsArr.forEach( (numberAlbum: string, index: number) => {
				if(+numberAlbum == card.albumId) {
					wasCoincidence = true;
				}
			})

			if(!wasCoincidence) {//если не было совпадений - добавить номер альбома в массив
				numberAlbumsArr.push(String(lastNumber));
			}
			wasCoincidence = false;
		});

		numberAlbumsArr.sort( (a: string, b: string) => {
			return +a - +b;
		}); //сортировка для упорядоченного выпадающего списка
		this.setState({albumsOptions: numberAlbumsArr});
	}

	onZoomImage = (url: string) => {
		this.setState({
			modalUrl: url,
			zoomed: true
		});
	}

	onCloseModal = (): void => {
		this.setState({zoomed: false});
	}

	onChangePage = (numberPageToGo: number) => {
		this.setState({numberPageToGo});
	}

    getAllPages = (data: ICard[]): void => {
        const {elementsAtPage} = this.state;

        let countPages: number = data.length / elementsAtPage;
        if(data.length % elementsAtPage > 0) countPages++;
        let arrPagesStr: string[] = [];

        for(let i=1; i<=countPages; i++) {
            arrPagesStr.push(String(i));
        }
		
		
		this.getListPages(arrPagesStr);
        this.setState({allPagesArr: arrPagesStr});
    }

	getListPages = (arrPagesStr: string[], maxPages: number = this.state.maxPages): void => {
        let newArrPages: string[] = [];
        

        if(arrPagesStr.length>maxPages) {
            newArrPages = arrPagesStr.filter( (number:string, index: number, array: string[]) => {
                if(index<maxPages-5) return number;
                if(index>=maxPages-5 && index<=array.length-4) return false
                return number
            })
            newArrPages.splice(maxPages-5, 0, "past");
            this.setState({newArrPages});
        } else {
			newArrPages=arrPagesStr;
			this.setState({newArrPages});
		}
    }

    onShowMorePages = () => {
		this.getAllPages(this.state.visibleData); //обновление полного количества страниц
	
		const {newArrPages, allPagesArr, maxPages} = this.state;
		
		const new2 = allPagesArr.slice(+newArrPages[29]-4); //список страниц сдвигается правее
		this.getListPages(new2);
    }

	render() {
		const {data, albumsOptions, term, modalUrl, numberPageToGo, zoomed, elementsAtPage, newArrPages, visibleData} = this.state;
		 
	
		return (
			<main className='App'>
				<Header />

				<Container>
					<SearchPanel
						term={term}
						albumsOptions={albumsOptions} 
						onUpdateSearch={this.onUpdateSearch}
					/>
					
					<Cards 
						cardsArr={visibleData} 
						page={numberPageToGo} 
						elementsAtPage={elementsAtPage}
						onDelete={this.onDelete}
						onZoomImage={this.onZoomImage}
					/>

					<ListPagesCards
						newArrPages={newArrPages} 
						elementsAtPage={elementsAtPage}
						onShowMorePages={this.onShowMorePages}
						onChangePage={this.onChangePage}
					/>
				</Container>

				<ZoomedImageModal
					onClose={this.onCloseModal} 
					zoomed={zoomed} 
					urlImage={modalUrl} 
				/>
			</main>
		);
	}
}

export default App;
