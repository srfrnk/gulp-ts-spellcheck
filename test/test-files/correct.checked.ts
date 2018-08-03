interface IPerson {
    firstname: string;
    lastName: string;
}

class Person implements IPerson {
    private internalState: string;

    constructor(public firstname: string, public lastName: string) {
    }

    public greeter() {
        return 'Hello, ' + this.firstname + ' ' + this.lastName;
    }
}

function greeter(person: IPerson) {
    return (person as Person).greeter();
}

const myFunc = (var1: string, var2: string): string => {
    const var3 = '111';
    return var3;
};

let user = { firstname: 'Jane', lastName: 'User' };

document.body.innerHTML = greeter(user);
