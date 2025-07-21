const map = document.getElementById('map');
const goldDisplay = document.getElementById('gold');
const powerDisplay = document.getElementById('army-power');
const nukesDisplay = document.getElementById('nukes');
const resultTitle = document.getElementById('result-title');
const resultVideo = document.getElementById('result-video');
let armyPower = 20;
let gold = 0;
let nukes = 0;
let selectedLocation = null;

const rewards = { Town: 100, Village: 200, City: 500 };
const powerRanges = {
  Town: [5, 20],
  Village: [20, 50],
  City: [50, 100]
};
const locations = [];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createMap() {
  const types = ['Town', 'Village', 'City'];
  types.forEach(type => {
    for (let i = 0; i < 10; i++) {
      const power = random(...powerRanges[type]);
      const loc = {
        id: locations.length,
        type,
        name: `${type} ${i + 1}`,
        power,
        conquered: false
      };
      locations.push(loc);

      const div = document.createElement('div');
      div.className = 'location';
      div.id = `loc-${loc.id}`;
      div.innerHTML = `<strong>${loc.name}</strong><br>Power: ${power}`;
      div.onclick = () => handleClick(loc);
      map.appendChild(div);
    }
  });
}

function handleClick(loc) {
  if (loc.conquered) return;
  selectedLocation = loc;
  if (nukes > 0) {
    document.getElementById('nuke-choice').classList.remove('hidden');
  } else {
    startBattle();
  }
}

function startBattle() {
  document.getElementById('nuke-choice').classList.add('hidden');
  const win = armyPower >= selectedLocation.power;
  document.getElementById('result-screen').classList.remove('hidden');
  resultTitle.innerText = win ? 'Victory!' : 'Defeat!';
  resultVideo.src = win ? 'assets/victory.mp4' : 'assets/defeat.mp4';

  if (win) {
    selectedLocation.conquered = true;
    document.getElementById(`loc-${selectedLocation.id}`).style.backgroundColor = '#8cd17d';
    gold += rewards[selectedLocation.type];
    goldDisplay.textContent = gold;
  }
}

function useNuke() {
  nukes--;
  nukesDisplay.textContent = nukes;
  document.getElementById('nuke-choice').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');
  resultTitle.innerText = 'Nuke Deployed! Victory!';
  resultVideo.src = 'assets/nuke.mp4';
  selectedLocation.conquered = true;
  document.getElementById(`loc-${selectedLocation.id}`).style.backgroundColor = '#ff6961';
  gold += rewards[selectedLocation.type];
  goldDisplay.textContent = gold;
}

function backToMap() {
  document.getElementById('result-screen').classList.add('hidden');
  selectedLocation = null;
}

function openShop() {
  document.getElementById('shop').classList.remove('hidden');
  document.getElementById('result-screen').classList.add('hidden');
}

function closeShop() {
  document.getElementById('shop').classList.add('hidden');
}

const shopItems = [
  { name: 'Infantry', cost: 50, power: 5 },
  { name: 'Archers', cost: 75, power: 7 },
  { name: 'Small Tanks (x3)', cost: 100, power: 10 },
  { name: 'Catapults (x3)', cost: 125, power: 12 },
  { name: 'Water Cannons (x3)', cost: 125, power: 12 },
  { name: 'Medium Tanks (x3)', cost: 150, power: 15 },
  { name: 'Flamethrowers (x3)', cost: 150, power: 15 },
  { name: 'Pipe Bombs', cost: 200, power: 20 },
  { name: 'Large Tanks (x3)', cost: 200, power: 20 },
  { name: 'Gas Bombs', cost: 250, power: 25 },
  { name: 'Cluster Bombs', cost: 250, power: 25 },
  { name: 'Missiles', cost: 300, power: 30 },
  { name: 'Strong Gas Bombs', cost: 300, power: 30 },
  { name: 'Atomic Bomb', cost: 300, power: 30 },
  { name: 'Nuke', cost: 500, power: 0, isNuke: true }
];

function renderShop() {
  const container = document.getElementById('shop-items');
  shopItems.forEach(item => {
    const btn = document.createElement('button');
    btn.textContent = `${item.name} - ${item.cost}G`;
    btn.onclick = () => buyItem(item);
    container.appendChild(btn);
  });
}

function buyItem(item) {
  if (gold < item.cost) return;
  gold -= item.cost;
  goldDisplay.textContent = gold;

  if (item.isNuke && nukes < 5) {
    nukes++;
    nukesDisplay.textContent = nukes;
  } else {
    armyPower += item.power;
    powerDisplay.textContent = armyPower;
  }
}

createMap();
renderShop();
