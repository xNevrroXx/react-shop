import "./number-page.scss";

interface IProp {
    numberPage: number
}

const NumberPage: React.FC<IProp> = ({numberPage}: IProp) => {

    return (
        <div className="number-page" key={"number page " + numberPage}>
            <span className="number-page__count">{numberPage} page</span>
        </div>
    )
}
export default NumberPage;