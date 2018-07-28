interface IPersin {
    firstname: string;
    lastname: string;
}

function greetar(percon: IPersin) {
    return 'Hella, ' + percon.firstname + ' ' + percon.lastname;
}

let usar = { firstname: 'Janqa', lastname: 'Useqr' };

document.body.innerHTML = greetar(usar);
