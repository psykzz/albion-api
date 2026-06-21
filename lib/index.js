const BASE_URL = process.env.ALBION_API_BASE || 'https://gameinfo.albiononline.com/api/gameinfo';

async function baseRequest(uri) {
  const url = `${BASE_URL}${uri}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }
  return response.json();
}

function buildQuery(opts = {}) {
  const params = new URLSearchParams();
  if (opts.limit) params.set('limit', opts.limit);
  if (opts.offset) params.set('offset', opts.offset);
  if (opts.range) params.set('range', opts.range);
  if (opts.sort) params.set('sort', opts.sort);
  if (opts.guildId) params.set('guildId', opts.guildId);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

async function getServerStatus() {
  const [live, staging] = await Promise.all([
    fetch('https://serverstatus.albiononline.com/').then(r => r.json()),
    fetch('https://serverstatus.staging01.albion.zone/').then(r => r.json()),
  ]);
  return {
    live: { status: live.status, message: live.message },
    staging: { status: staging.status, message: staging.message },
  };
}

async function search(query) {
  return baseRequest(`/search?q=${encodeURIComponent(query)}`);
}

// Events / Kills

async function getRecentEvents(opts = {}) {
  return baseRequest(`/events${buildQuery(opts)}`);
}

const getRecentKills = getRecentEvents;

async function getEventDetails(eventId) {
  return baseRequest(`/events/${eventId}`);
}

const getKillDetails = getEventDetails;

async function getEventsBetween(eventId1, eventId2) {
  return baseRequest(`/events/${eventId1}/history/${eventId2}`);
}

const getPlayerFued = getEventsBetween;

// Guild

async function getGuildInfo(guildId) {
  return baseRequest(`/guilds/${guildId}`);
}

async function getGuildData(guildId) {
  return baseRequest(`/guilds/${guildId}/data`);
}

async function getGuildTopKills(guildId, opts = {}) {
  return baseRequest(`/guilds/${guildId}/top${buildQuery(opts)}`);
}

async function getGuildStats(guildId) {
  return baseRequest(`/guilds/${guildId}/stats`);
}

async function getGuildMembers(guildId) {
  return baseRequest(`/guilds/${guildId}/members`);
}

async function getGuildFeud(guildId1, guildId2) {
  return baseRequest(`/guilds/${guildId1}/feud/${guildId2}`);
}

const getGuildFued = getGuildFeud;

// Alliance

async function getAllianceInfo(allianceId) {
  return baseRequest(`/alliances/${allianceId}`);
}

// Player

async function getPlayerInfo(playerId) {
  return baseRequest(`/players/${playerId}`);
}

async function getPlayerTopKills(playerId, opts = {}) {
  return baseRequest(`/players/${playerId}/topkills${buildQuery(opts)}`);
}

async function getPlayerSoloKills(playerId, opts = {}) {
  return baseRequest(`/players/${playerId}/solokills${buildQuery(opts)}`);
}

async function getPlayerKills(playerId, opts = {}) {
  return baseRequest(`/players/${playerId}/kills${buildQuery(opts)}`);
}

async function getPlayerDeaths(playerId, opts = {}) {
  return baseRequest(`/players/${playerId}/deaths${buildQuery(opts)}`);
}

// Battles

async function getRecentBattles(opts = {}) {
  return baseRequest(`/battles${buildQuery(opts)}`);
}

async function getBattleDetails(battleId) {
  return baseRequest(`/battles/${battleId}`);
}

module.exports = {
  search,
  getServerStatus,
  getRecentKills, getKillDetails, getPlayerFued,
  getRecentEvents, getEventDetails, getEventsBetween,
  getGuildInfo, getGuildData, getGuildTopKills, getGuildStats, getGuildMembers, getGuildFeud, getGuildFued,
  getAllianceInfo,
  getPlayerInfo, getPlayerSoloKills, getPlayerTopKills, getPlayerKills, getPlayerDeaths,
  getRecentBattles, getBattleDetails,
};