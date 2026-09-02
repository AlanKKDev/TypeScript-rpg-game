import { Mage } from './classes/Mage';
import { loadPlayers, Player } from './classes/Player';
import { Warrior } from './classes/Warrior';

const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
    // new Player('Player1', 100, 100);
    // new Player('Player2', 100, 150);
    // Object.values(Players).map(player => {
    //     player.render();
    // });

    const formDiv = document.createElement('div');
    formDiv.innerHTML = `
        <h2>Create New Character</h2>
        <input id="input-username" type="text" placeholder="Username..." required/>
        <input id="input-hp" type="number" placeholder="HP" value="100"/>
        <select id="select-role">
            <option value="Warrior">Warrior</option>
            <option value="Mage">Mage</option>
        </select>
        <button id="btn-create">Create</button>
    `;
    app.appendChild(formDiv);

    const createBtn = formDiv.querySelector<HTMLButtonElement>('#btn-create');
    createBtn?.addEventListener('click', () => {
        const usernameInput = formDiv.querySelector<HTMLInputElement>('#input-username');
        if (!usernameInput) return;

        const hpInput = formDiv.querySelector<HTMLInputElement>('#input-hp');
        if (!hpInput) return;

        // const hp = Number(hpInput.value);

        const roleSelect = formDiv.querySelector<HTMLSelectElement>(`#select-role`);
        const selectedRole = roleSelect?.value;

        let newPlayer: Player | null = null;

        if (selectedRole === 'Warrior') {
            newPlayer = new Warrior(usernameInput.value);
        } else if (selectedRole === 'Mage') {
            newPlayer = new Mage(usernameInput.value);
        }

        newPlayer?.render();
        usernameInput.value = '';
    });

    const dataPlayers = loadPlayers();
    console.log(dataPlayers);
    if (dataPlayers) {
        Object.values(dataPlayers).map(playerData => {
            let player: Player | null = null;
            if (playerData.role === 'Warrior') {
                player = new Warrior(playerData.username);
            } else if (playerData.role === 'Mage') {
                player = new Mage(playerData.username);
            } else {
                return;
            }

            player.health = playerData.health;
            player.inventory = playerData.inventory ?? {};
            player.pet = playerData.pet;
            player.isAlive = playerData.isAlive;
            player.render();
        });
    }
}
