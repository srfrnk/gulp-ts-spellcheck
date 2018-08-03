interface IPersin {
    firstname: string;
    lastname: string;
}

class Persin implements IPersin {
    private internalState: string;

    constructor(public firstname: string, public lastname: string) {
    }

    public greetar() {
        return 'Hello, ' + this.firstname + ' ' + this.lastname;
    }
}

function greetar(percon: IPersin) {
    return (percon as Persin).greetar();
}

const myFonc = (vuur1: string, vuur2: string): string => {
    const vuur3 = '111';
    return vuur3;
};

let usar = { firstname: 'Janqa', lastname: 'Useqr' };

document.body.innerHTML = greetar(usar);
