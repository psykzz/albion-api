# Albion API

A JavaScript library for the [Albion Online](https://albiononline.com) game info API.

## Installation

```sh
npm install albion-api
```

## Requirements

Node.js 18 or later (uses native `fetch`).

## Usage

```js
const albion = require('albion-api');

// Search for players, guilds or alliances
const results = await albion.search('MyGuild');

// Get player info
const player = await albion.getPlayerInfo('playerIdHere');

// Get recent kills
const kills = await albion.getRecentKills({ limit: 10 });

// Get guild info and members
const guild = await albion.getGuildInfo('guildIdHere');
const members = await albion.getGuildMembers('guildIdHere');

// Get recent battles
const battles = await albion.getRecentBattles({ limit: 5, sort: 'recent' });
```

## API Reference

All functions return Promises. The base URL defaults to `https://gameinfo.albiononline.com/api/gameinfo` and can be overridden via the `ALBION_API_BASE` environment variable.

### Server

| Function | Description |
|---|---|
| `getServerStatus()` | Live and staging server status |

### Search

| Function | Description |
|---|---|
| `search(query)` | Search for players, guilds, and alliances |

### Events / Kills

| Function | Description |
|---|---|
| `getRecentEvents(opts)` | Recent events — `limit`, `offset` |
| `getRecentKills(opts)` | Alias for `getRecentEvents` |
| `getEventDetails(eventId)` | Details for a specific event |
| `getKillDetails(eventId)` | Alias for `getEventDetails` |
| `getEventsBetween(eventId1, eventId2)` | Events between two IDs |

### Guilds

| Function | Description |
|---|---|
| `getGuildInfo(guildId)` | Basic guild info |
| `getGuildData(guildId)` | Extended guild data |
| `getGuildTopKills(guildId, opts)` | Top kills — `limit`, `offset`, `range` |
| `getGuildStats(guildId)` | Guild statistics |
| `getGuildMembers(guildId)` | Guild member list |
| `getGuildFeud(guildId1, guildId2)` | Feud between two guilds |

### Alliances

| Function | Description |
|---|---|
| `getAllianceInfo(allianceId)` | Alliance information |

### Players

| Function | Description |
|---|---|
| `getPlayerInfo(playerId)` | Player profile |
| `getPlayerTopKills(playerId, opts)` | Top kills — `limit`, `offset`, `range` |
| `getPlayerSoloKills(playerId, opts)` | Solo kills |
| `getPlayerKills(playerId, opts)` | Kill history |
| `getPlayerDeaths(playerId, opts)` | Death history |

### Battles

| Function | Description |
|---|---|
| `getRecentBattles(opts)` | Recent battles — `limit`, `offset`, `sort`, `guildId` |
| `getBattleDetails(battleId)` | Details for a specific battle |

## Documentation

Generate JSDoc docs locally:

```sh
npm run generate-docs
```

## Contributing

All contributions, issues and pull requests are welcome!