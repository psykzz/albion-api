var debug = require('debug')('AlbionAPI');
var request = require('request');

function baseRequest(uri) {
  request(`https://gameinfo.albiononline.com/api/gameinfo${uri}`, function (error, response, body) {
    debug(`statusCode: ${response && response.statusCode}`);
    cb(error, JSON.parse(body));
  });
}

// -- Searching
//

function search(query, cb) {
  debug(`Searching for: ${query}`);
  baseRequest(`/search?q=${query}`, cb);
}

// -- Events / Kills
//

function getRecentEvents(opts, cb) {
  opts = opts || {};
  query = "?";
  if(opts.limit) {
    query += `limit=${opts.limit}`;
  }
  if(opts.offset) {
    query += `offset=${opts.offset}`;
  }
  // https://gameinfo.albiononline.com/api/gameinfo/events?limit=51&offset=0
  baseRequest(`/events`, cb);
}
var getRecentKills = getRecentEvents;

function getEventDetails(eventId, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/events/2484174
  baseRequest(`/events/${eventId}`, cb);
}
var getKillDetails = getEventDetails;

function getEventsBetween(eventId1, eventId2, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/events/p_BN_ZrdSwSgtOdebp-8mw/history/4RpreMJdRqev6t6dm1zKUg
  baseRequest(`/events/${eventId1}/history/${eventId2}`, cb);
}
var getPlayerFued = getEventsBetween;

// -- Guild
//

function getGuildInfo(guildId, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/guilds/vFUVDtWgQwK-4NNwf0xo_w
  baseRequest(`/guilds/${guildId}`, cb);
}

function getGuildData(guildId, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/guilds/vFUVDtWgQwK-4NNwf0xo_w/data
  baseRequest(`/guilds/${guildId}/data`, cb);
}

function getGuildTopKills(guildId, opts, cb) {
  opts = opts || {};
  query = "?";
  if(opts.limit) {
    query += `limit=${opts.limit}`;
  }
  if(opts.offset) {
    query += `offset=${opts.offset}`;
  }
  if(opts.range) { // week, lastWeek, month, lastMonth
    query += `range=${opts.range}`;
  }
  // https://gameinfo.albiononline.com/api/gameinfo/guilds/vFUVDtWgQwK-4NNwf0xo_w/data
  baseRequest(`/guilds/${guildId}/top${query}`, cb);
}

function getGuildStats(guildId, cb) {
  //https://gameinfo.albiononline.com/api/gameinfo/guilds/3InalPCfQL-GAmGZ-XafhQ/stats
  baseRequest(`/guilds/${guildId}/stats`, cb);
}

function getGuildMembers(guildId, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/guilds/vFUVDtWgQwK-4NNwf0xo_w/members
  baseRequest(`/guilds/${guildId}/members`, cb);
}

function getGuildFued(guildId1, guildId2, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/guilds/r-pjy3pRSMWx-OKqwT-SBg/feud/55EvzyTZQsG70sOuoGXgog
  baseRequest(`/guilds/${guildId1}/fued/${guildId2}`, cb);
}

// -- Player
//

function getPlayerInfo(playerId, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/players/Nubya8P6QWGhI6hDLQHIQQ
  baseRequest(`/players/${playerId}`, cb);
}

module.exports = {
  search,
  getGuildInfo, getGuildMembers,
  getPlayerInfo
}
