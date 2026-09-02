import { Player, savePlayers } from './Player';

export class Mage extends Player {
    public readonly role = 'Mage';

    public mana: number = 100;

    constructor(username: string) {
        super(username, 80, 80);
    }

    public getCustomStatsHtml(): string {
        return `<p style="color: #3498db;">Mana: <b>${this.mana} / 100</b></p>`;
    }

    public useSpecialSkill(): void {
        if (this.mana < 30) {
            alert('Not enough mana!');
            return;
        }
        this.mana -= 30;
        this.addItem('Apple', 1);
        this.render();
        savePlayers();
    }
}
