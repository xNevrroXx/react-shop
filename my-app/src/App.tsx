import { Fragment, Component, useState } from 'react';
import { Container, Box } from '@mui/material';

//// my modules ////
import getData from './Components/services/services';
import Header from "./Components/blocks/header/header";
import SearchPanel from './Components/blocks/search-panel/search-panel';
import Cards from './Components/blocks/cards/cards';
import ZoomedImageModal from './Components/blocks/zoomed-image/zoomed-image';
import ListPagesCards from './Components/blocks/listPagesCards/list-pages-cards';
import NumberPage from './Components/blocks/listPagesCards/number-page';

import "./app.scss";
import { rejects } from 'assert';

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
	data: {
		data: ICard[],
		visibleData: ICard[]
	}
	searchPanel: {
		albumsOptions: string[],
		term: string
	}
	zoomedImages: {
		modalUrl: string,
		zoomed: boolean,
	}
	listPages: {
		allPagesArr: string[],
		newArrPages: string[],
		maxPages: number,
		countPages: number
	}
	pagesProperties: {
		elementsAtPage: number,
		numberPageToGo: number
	}
}

class App extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			data: {
				data: [],
				visibleData: []
			},
			searchPanel: {
				albumsOptions: [],
				term: "All"
			},
			zoomedImages: {
				modalUrl: "",
				zoomed: false
			},
			listPages: {
				allPagesArr: [],
				newArrPages: [],
				maxPages: 25,
				countPages: 0
			},
			pagesProperties: {
				elementsAtPage: 16,
				numberPageToGo: 1,
			}
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
			this.setState({data: {
				...this.state.data, 
				data
			}});

			this.getAlbumsOptions();
			this.getData(data, this.state.searchPanel.term);
			this.getAllPages(data);
			this.getListPages({arrPagesStr: this.state.listPages.allPagesArr});
		})
	}

	onUpdateSearch = (term: string) => {
		new Promise((resolve) => {
			resolve(
				this.setState( {searchPanel: {
					...this.state.searchPanel,
					term
				}, 
				pagesProperties: {
					...this.state.pagesProperties,
					numberPageToGo: 1
				}
			}))	
		})
		.then( () => {
			this.getData(this.state.data.data, term);
		})
		
		
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

		this.setState({data: {
			...this.state.data,
			visibleData
			}
		});

		this.getAllPages(visibleData);
	}

	onDelete = (id: number) => {
		new Promise((resolve) => {
			resolve(
				this.setState( ({data}) => {
					return {
						data: {
							...this.state.data,
							data: data.data.filter(card => card.id !== id)
						}
					}
				})
		 	)
		})
		.then(() => {
			this.getAlbumsOptions();
			}
		)
		.then(() => {
			this.getData(this.state.data.data, this.state.searchPanel.term);
			}
		)		
	}

	getAlbumsOptions = (): void => {
		const {data} = this.state.data;
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

		this.setState({searchPanel: {
			...this.state.searchPanel,
			albumsOptions: numberAlbumsArr
			} 
		});
	}

	onZoomImage = (url: string) => {
		this.setState({zoomedImages: {
			modalUrl: url,
			zoomed: true
			}
		});
	}

	onCloseModal = (): void => {
		this.setState({zoomedImages: {
			...this.state.zoomedImages,
			zoomed: false
			}
		});
	}

	onChangePage = (numberPageToGo: number) => {
		if(numberPageToGo===1)
			this.getListPages({
				arrPagesStr: this.state.listPages.newArrPages,
				goFirstPage: true
			})

		this.setState({pagesProperties: {
			...this.state.pagesProperties,
			numberPageToGo
			}
		});
	}

    getAllPages = (data: ICard[]): void => {//Проверить!!!
		const {elementsAtPage, numberPageToGo} = this.state.pagesProperties;
		const {countPages: lastCountPages, maxPages, newArrPages} = this.state.listPages;

		let countPages: number = Math.floor(data.length / elementsAtPage);
		if(data.length % elementsAtPage > 0) countPages++;

		this.setState({listPages: {
			...this.state.listPages,
			countPages: countPages
			}
		})
		
		let arrPagesStr: string[] = [];
		for(let i=1; i<=countPages; i++) {
			arrPagesStr.push(String(i));
		}
		this.setState({listPages: {
			...this.state.listPages,
			allPagesArr: arrPagesStr
			}
		});
		if(countPages > maxPages && lastCountPages!=0) {
			console.log(true)
			console.log(newArrPages)
			if(newArrPages.length>=maxPages) {
				if(countPages !== lastCountPages) {
					const newArrPages: string[] = [...this.state.listPages.newArrPages];
					if( (+newArrPages[newArrPages.length-5]+1) === (+newArrPages[newArrPages.length-3]-1) ) {
						console.log("===")
						newArrPages.splice(newArrPages.length-4, 1)
					} else if( (+newArrPages[newArrPages.length-4]+1) === (+newArrPages[newArrPages.length-3]) ) {
						this.setState( ({listPages}) => {
							return {
								listPages: {
									...this.state.listPages,
									newArrPages: this.state.listPages.newArrPages.map((number: string, index: number) => String(+number+1))
								}
							}
						})

						return
					}
					console.log("===mmm, " + (+newArrPages[newArrPages.length-3]-1) + " and " + (+newArrPages[newArrPages.length-5]+1))
					newArrPages.splice(newArrPages.length-3, 3,
						String(+newArrPages[newArrPages.length-3]-1),
						String(+newArrPages[newArrPages.length-2]-1),
						String(+newArrPages[newArrPages.length-1]-1));
						console.log(newArrPages)
	
					this.setState({listPages: {
						...this.state.listPages,
						newArrPages: newArrPages
						}
					})
					return
				} else {
					console.log("here2")
					return
				}
			}
		}
		

/* 		let arrPagesStr: string[] = [];
		for(let i=1; i<=countPages; i++) {
			arrPagesStr.push(String(i));
		} */

		this.getListPages({arrPagesStr});
/* 		this.setState({listPages: {
			...this.state.listPages,
			allPagesArr: arrPagesStr
			}
		}); */
	}

	getListPages = (
		{arrPagesStr, maxPages = this.state.listPages.maxPages, goFirstPage = false}
		: {arrPagesStr: string[], maxPages?: number, goFirstPage?: boolean}
		): void => {
		const {allPagesArr} = this.state.listPages;
        let newArrPages: string[] = [];
		
		if(goFirstPage && allPagesArr.length>maxPages) {
			this.getListPages({arrPagesStr: allPagesArr});
			return;
		}	

        if(arrPagesStr.length>maxPages) {
            newArrPages = arrPagesStr.filter( (number:string, index: number, array: string[]) => {
                if(index<=maxPages-5) return number;
                if(index>maxPages-5 && index<=array.length-4) return false;
                return number;
            })
            newArrPages.splice(maxPages-4, 0, "past");
        } else {
			newArrPages=arrPagesStr;
		}

		if(allPagesArr.length>maxPages && !newArrPages.includes("1"))//если страницы подвинуты правее - добавить "1"
				newArrPages.unshift("1");

		this.setState({listPages: {
			...this.state.listPages,
			newArrPages
			}
		});
    }

    onShowMorePages = () => {
		this.getAllPages(this.state.data.visibleData); //обновление полного количества страниц
	
		const {newArrPages, allPagesArr, maxPages} = this.state.listPages;
		
		const new2 = allPagesArr.slice(+newArrPages[maxPages-6]-4); //список страниц сдвигается правее
		this.getListPages({arrPagesStr: new2});
    }

	render() {
		const {modalUrl, zoomed} = this.state.zoomedImages;
		const {albumsOptions, term} = this.state.searchPanel;
		const {data, visibleData} = this.state.data;
		const {numberPageToGo, elementsAtPage} = this.state.pagesProperties;
		const {newArrPages} = this.state.listPages;
	
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

				<NumberPage numberPage={numberPageToGo}/>

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
