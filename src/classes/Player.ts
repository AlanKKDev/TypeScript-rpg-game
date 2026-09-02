import { getRandomPet, type Pet } from '../api/PokemonApi';
import { itemsData } from '../data/ItemsData';

export type SavedPlayerData = {
    role: 'Warrior' | 'Mage';
    username: string;
    health: number;
    maxHealth: number;
    isAlive: boolean;
    inventory: Record<string, number>;
    pet?: Pet;
};

export let Players: Record<string, Player> = {};

export abstract class Player {
    public abstract readonly role: 'Warrior' | 'Mage';
    public readonly username: string;
    public health: number;
    public readonly maxHealth: number;
    public isAlive: boolean = true;
    public pet?: Pet;
    public inventory: Record<string, number> = {};

    constructor(username: string, health: number = 100, maxHealth: number = 100) {
        this.username = username;
        this.health = health;
        this.maxHealth = maxHealth;

        if (!Players[username]) {
            Players[username] = this;
        } else {
            console.log(`Player ${username} already exists!`);
            return;
        }
    }

    public abstract useSpecialSkill(): void;

    public takeDamage(amount: number): void {
        this.health = Math.max(this.health - amount, 0);
        if (this.health === 0) {
            this.isAlive = false;
            this.destroy();
        }
        savePlayers();
    }

    public heal(amount: number): void {
        if (!this.isAlive) return;
        this.health = Math.min(this.health + amount, this.maxHealth);
        savePlayers();
    }

    public addItem(itemName: string, amount: number = 1): void {
        const current = this.inventory[itemName] ?? 0;
        this.inventory[itemName] = current + amount;
        savePlayers();
    }

    public async assignRandomPet(buttonElement?: HTMLButtonElement): Promise<void> {
        if (buttonElement) {
            buttonElement.disabled = true;
            buttonElement.textContent = 'Adopting...';
        }

        try {
            const randomPet = await getRandomPet();
            this.pet = randomPet;
            this.render();
            savePlayers();
        } catch (error) {
            alert('Failed to adopt pet!');
        } finally {
            if (buttonElement) {
                buttonElement.disabled = false;
                buttonElement.textContent = 'Adopt pet';
            }
        }
    }

    public destroy(): void {
        delete Players[this.username];

        const playerDiv = document.querySelector<HTMLDivElement>(`#player-${this.username}`);
        playerDiv?.remove();
        savePlayers();
    }

    public render(): void {
        if (!this.isAlive) return;

        const app = document.querySelector<HTMLDivElement>('#app');
        if (!app) return;

        let playerDiv = document.querySelector<HTMLDivElement>(`#player-${this.username}`);
        if (!playerDiv) {
            playerDiv = document.createElement('div');
            playerDiv.id = `player-${this.username}`;
            app.appendChild(playerDiv);
        }

        const inventoryHtml = Object.entries(this.inventory)
            .map(([itemName, amount]) => {
                const itemData = itemsData[itemName];
                if (!itemData) console.log(`Item ${itemName} does not exist`);

                return `<li><span color="${itemData.color}">${itemName}</span> x${amount}</li>`;
            })

            .join('');

        const equippedPet = this.pet
            ? `<img src="${this.pet.sprites.front_default}" alt="${this.pet.name}" /><p>Pet: ${this.pet.name}</p>`
            : '';

        playerDiv.innerHTML = `
            <h1>${this.username}</h1>
            <p>Health: ${this.health} / ${this.maxHealth} (${this.isAlive ? 'Alive' : 'Dead'})</p>
            <h2>Inventory:</h2>
            <ul>${inventoryHtml}</ul>
            ${equippedPet}
            <button id="btn-attack">Take 20 DMG</button>
            <button id="btn-heal">Heal 20 HP</button>
            <button id="btn-loot">Add Random Loot</button>
            <button id="btn-pet">Adopt Pet</button>
        `;

        const attackBtn = playerDiv.querySelector<HTMLButtonElement>(`#btn-attack`);
        attackBtn?.addEventListener('click', () => {
            this.takeDamage(20);
            this.render();
        });

        const healBtn = playerDiv.querySelector<HTMLButtonElement>(`#btn-heal`);
        healBtn?.addEventListener('click', () => {
            this.heal(20);
            this.render();
        });

        const randomLoot = playerDiv.querySelector<HTMLButtonElement>(`#btn-loot`);
        randomLoot?.addEventListener('click', () => {
            const randomItemName = getRandomItemName();
            this.addItem(randomItemName, 1);
            this.render();
        });

        const adoptPet = playerDiv.querySelector<HTMLButtonElement>(`#btn-pet`);
        adoptPet?.addEventListener('click', () => {
            this.assignRandomPet(adoptPet);
        });
    }
}

function getRandomItemName(): string {
    const itemNames = Object.keys(itemsData);
    const randomIndex = Math.floor(Math.random() * itemNames.length);

    return itemNames[randomIndex];
}

export function savePlayers(): void {
    localStorage.setItem('rpg_players', JSON.stringify(Players));
}

export function loadPlayers(): Record<string, SavedPlayerData> | null {
    const storageData = localStorage.getItem('rpg_players');
    if (!storageData) return null;

    return JSON.parse(storageData) as Record<string, SavedPlayerData>;
}
