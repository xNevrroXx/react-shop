import { Fragment, Component } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { Construction, ConstructionOutlined } from "@mui/icons-material";

interface IProps {
    albumsOptions: string[], 
    onUpdateSearch: (term: string) => void
} 

interface IState {
    term: string
}


class SearchPanel extends Component<IProps, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            term: "",
        }
    }
    
    onUpdateSearch = (e: any) => {
        const term: string = e.target.value;
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
                fullWidth
                isOptionEqualToValue={(options, value) => {
                        // if(options.includes(value)) {
                        //     console.log("includes");
                        //     return true;
                        // }
                        // value="55";
                        return false;
                    }
                }
                renderInput = {(params: any) => 
                    <TextField {...params}
                        value={term}
                        onChange={this.onUpdateSearch} 
                        label="search" 
                        type="search"
                        variant="standard" />
                    } 
    
            />
        )
    }
}

export default SearchPanel;