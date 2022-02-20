import {Component} from "react";
import {Box} from "@mui/material";

import "./zoomed-image.scss";

interface IProps {
    zoomed: boolean,
    urlImage: string,
    onClose: () => void
}

class ZoomedImageModal extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    onClose = (e: any) => {
        if(e.currentTarget === e.target) //клик только на фоне
            this.props.onClose();
    }

    render() {
        const {zoomed, urlImage} = this.props;
        const classModal = zoomed ? " modal_active" : "";

        return (
            <Box
                onClick={this.onClose} 
                className={"modal" + classModal}
            >
                <img
                    className="modal__image"
                    src={urlImage}
                    alt="zoomed image" />
            </Box>
        )
    }
}

export default ZoomedImageModal;