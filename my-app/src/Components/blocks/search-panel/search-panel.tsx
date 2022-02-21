import { Fragment, Component } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { Construction, ConstructionOutlined } from "@mui/icons-material";

interface IProps {
    albumsOptions: string[], 
    term: string,
    onUpdateSearch: (term: string) => void
} 

interface IState {
    term: string
}


class SearchPanel extends Component<IProps, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            term: "All",
        }
    }
    
    onUpdateSearch = (e: any, value: string) => {
        const term: string = value;
        this.setState({term});
        this.props.onUpdateSearch(term);
    }

    render() {
        const {albumsOptions} = this.props;
        const {term} = this.state;

        return (
            <Autocomplete
                sx={{mb: "20px"}}
                options={albumsOptions}
                value={term}
                onInputChange={this.onUpdateSearch}
                fullWidth
                renderInput = {(params: any) => 
                    <TextField {...params}
                        value={term}
                        label="search AlbumID" 
                        type="search"
                        variant="standard" />
                    } 
    
            />
        )
    }
}

export default SearchPanel;