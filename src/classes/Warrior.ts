import { Player } from './Player';

export class Warrior extends Player {
    public readonly role = 'Warrior' as const;

    constructor(username: string) {
        super(username, 150, 150);
    }

    public override takeDamage(amount: number): void {
        super.takeDamage(amount * 0.8);
    }

    public useSpecialSkill(): void {
        super.heal(30);
    }
}
