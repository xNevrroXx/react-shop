

const getData = async(url: string) => {
    const result = await fetch(url);

    if(!result.ok)
        throw new Error(`Could nor fetch ${url}, status ${result.status}`);

    return result.json();
}

export default getData;