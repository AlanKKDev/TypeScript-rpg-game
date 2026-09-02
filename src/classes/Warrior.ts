import { Player } from './Player';

export class Warrior extends Player {
    public readonly role = 'Warrior' as const;

    constructor(username: string) {
        super(username, 150, 150);
    }

    public takeDamage(amount: number): void {
        this.health = Math.max(this.health - amount * 0.8, 0);
    }

    public useSpecialSkill(): void {
        this.heal(30);
    }
}
