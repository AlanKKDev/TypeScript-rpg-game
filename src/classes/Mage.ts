import { Player } from './Player';

export class Mage extends Player {
    public readonly role = 'Mage';

    public mana: number = 100;

    constructor(username: string) {
        super(username, 80, 80);
    }

    public useSpecialSkill(): void {
        this.mana -= 30;
    }
}
