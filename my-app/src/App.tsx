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
	elementsAtPage: number,
	numberPageToGo: number,
	albumsOptions: string[],
	term: string,
	modalUrl: string,
	zoomed: boolean
}

class App extends Component<IProps, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			data: [],
			elementsAtPage: 16,
			numberPageToGo: 1,
			albumsOptions: [],
			term: "",
			modalUrl: "",
			zoomed: false
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
		})
	}

	onUpdateSearch = (term: string) => {
		this.setState({term, numberPageToGo: 1})
	}

	getData = (data: ICard[], term: string): ICard[] => {
		let visibleData: ICard[] = [];

		if(term !== "")
			visibleData = data.filter( (card: ICard) => card.albumId == +term)
		else
			visibleData = data;

		return visibleData;
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
		
	}

	getAlbumsOptions = (): void => {
		const {data} = this.state;
		let numberAlbumsArr: string[] = [];

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

	render() {
		const {data, albumsOptions, term, modalUrl, numberPageToGo, zoomed, elementsAtPage} = this.state;
		const visibleData = this.getData(data, term);
		 
	
		return (
			<main className='App'>
				<Header />

				<Container>
					<SearchPanel
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
						data={visibleData} 
						elementsAtPage={elementsAtPage}
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
