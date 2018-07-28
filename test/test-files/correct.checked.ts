interface IPerson {
    firstname: string;
    lastName: string;
}

function greeter(person: IPerson) {
    return 'Hello, ' + person.firstname + ' ' + person.lastName;
}

let user = { firstname: 'Jane', lastName: 'User' };

document.body.innerHTML = greeter(user);
