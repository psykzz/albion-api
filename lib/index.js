var debug = require('debug')('AlbionAPI');
var request = require('request');

var BASE_URL = process.env.ALBION_API_BASE || 'https://gameinfo.albiononline.com/api/gameinfo';

/**
 * baseRequest - description
 *
 * @param  {type} uri description
 * @param  {callback} cb  description
 * @private
 */
function baseRequest(uri, cb) {
  var url = `${BASE_URL}${uri}`;
  request(url, function (error, response, body) {
    debug(`Url: ${url} statusCode: ${response && response.statusCode}`);
    if(error || (response && response.statusCode === 404)) {
       return cb(error || response);
    }
    cb(null, JSON.parse(body));
  });
}

/**
 * getServerStatus - description
 *
 * @param  {callback} cb  description
 */
function getServerStatus(cb) {
  request('https://serverstatus.albiononline.com/', (error, response, body) => {
    if (error) {
      return cb(error);
    }
    if (response.statusCode !== 200) {
      return cb(new Error(`Unexpected status code: ${response.statusCode}`));
    }
    try {
      var result = JSON.parse(body.trim());
      cb(null, {
        status: result.status,
        message: result.message,
      });
    } catch (e) {
      cb(e);
    }
  });
}

// -- Searching
//

/**
 * search - description
 *
 * @param  {string} query description
 * @param  {callback} cb    description
 */
function search(query, cb) {
  debug(`Searching for: ${query}`);
  baseRequest(`/search?q=${query}`, cb);
}

// -- Events / Kills
//

/**
 * getRecentEvents - description
 *
 * @param  {object} opts description
 * @param  {callback} cb   description
 */
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
  baseRequest(`/events${query}`, cb);
}
var getRecentKills = getRecentEvents;

/**
 * getEventDetails - description
 *
 * @param  {string} eventId description
 * @param  {callback} cb      description
 */
function getEventDetails(eventId, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/events/2484174
  baseRequest(`/events/${eventId}`, cb);
}
var getKillDetails = getEventDetails;

/**
 * getEventsBetween - description
 *
 * @param  {string} eventId1 description
 * @param  {string} eventId2 description
 * @param  {callback} cb       description
 */
function getEventsBetween(eventId1, eventId2, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/events/p_BN_ZrdSwSgtOdebp-8mw/history/4RpreMJdRqev6t6dm1zKUg
  baseRequest(`/events/${eventId1}/history/${eventId2}`, cb);
}
var getPlayerFued = getEventsBetween;

// -- Guild
//

/**
 * getGuildInfo - description
 *
 * @param  {string} guildId description
 * @param  {callback} cb      description
 */
function getGuildInfo(guildId, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/guilds/vFUVDtWgQwK-4NNwf0xo_w
  baseRequest(`/guilds/${guildId}`, cb);
}

/**
 * getGuildData - description
 *
 * @param  {string} guildId description
 * @param  {callback} cb      description
 */
function getGuildData(guildId, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/guilds/vFUVDtWgQwK-4NNwf0xo_w/data
  baseRequest(`/guilds/${guildId}/data`, cb);
}

/**
 * getGuildTopKills - description
 *
 * @param  {string} guildId description
 * @param  {object} opts    description
 * @param  {callback} cb      description
 */
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

/**
 * getGuildStats - description
 *
 * @param  {string} guildId description
 * @param  {callback} cb      description
 */
function getGuildStats(guildId, cb) {
  //https://gameinfo.albiononline.com/api/gameinfo/guilds/3InalPCfQL-GAmGZ-XafhQ/stats
  baseRequest(`/guilds/${guildId}/stats`, cb);
}

/**
 * getGuildMembers - description
 *
 * @param  {string} guildId description
 * @param  {callback} cb      description
 */
function getGuildMembers(guildId, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/guilds/vFUVDtWgQwK-4NNwf0xo_w/members
  baseRequest(`/guilds/${guildId}/members`, cb);
}

/**
 * getGuildFeud - description
 *
 * @param  {string} guildId1 description
 * @param  {string} guildId2 description
 * @param  {callback} cb       description
 */
function getGuildFeud(guildId1, guildId2, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/guilds/r-pjy3pRSMWx-OKqwT-SBg/feud/55EvzyTZQsG70sOuoGXgog
  baseRequest(`/guilds/${guildId1}/feud/${guildId2}`, cb);
}

// Alias for backward compatibility (typo in original name)
var getGuildFued = getGuildFeud;

// -- Player
//

/**
 * getPlayerInfo - description
 *
 * @param  {string} playerId description
 * @param  {callback} cb       description
 */
function getPlayerInfo(playerId, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/players/Nubya8P6QWGhI6hDLQHIQQ
  baseRequest(`/players/${playerId}`, cb);
}

/**
 * getPlayerTopKills - description
 *
 * @param  {string} playerId description
 * @param  {object} opts Options
 * @param  {callback} cb       description
 */
function getPlayerTopKills(playerId, opts, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/players/Nubya8P6QWGhI6hDLQHIQQ
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
  baseRequest(`/players/${playerId}/topkills${query}`, cb);
}

/**
 * getPlayerSoloKills - description
 *
 * @param  {string} playerId description
 * @param  {object} opts Options
 * @param  {callback} cb       description
 */
function getPlayerSoloKills(playerId, opts, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/players/Nubya8P6QWGhI6hDLQHIQQ
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
  baseRequest(`/players/${playerId}/solokills${query}`, cb);
}

/**
 * getPlayerKills - description
 *
 * @param  {string} playerId description
 * @param  {object} opts Options
 * @param  {callback} cb       description
 */
function getPlayerKills(playerId, opts, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/players/{playerId}/kills
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
  baseRequest(`/players/${playerId}/kills${query}`, cb);
}

/**
 * getPlayerDeaths - description
 *
 * @param  {string} playerId description
 * @param  {object} opts Options
 * @param  {callback} cb       description
 */
function getPlayerDeaths(playerId, opts, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/players/{playerId}/deaths
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
  baseRequest(`/players/${playerId}/deaths${query}`, cb);
}

// -- Battles
//

/**
 * getRecentBattles - description
 *
 * @param  {object} opts description
 * @param  {callback} cb   description
 */
function getRecentBattles(opts, cb) {
  opts = opts || {};
  query = "?";
  if(opts.limit) {
    query += `limit=${opts.limit}&`;
  }
  if(opts.offset) {
    query += `offset=${opts.offset}&`;
  }
  if(opts.sort) {
    query += `sort=${opts.sort}&`;
  }
  if(opts.guildId) {
    query += `guildId=${opts.guildId}&`;
  }
  // https://gameinfo.albiononline.com/api/gameinfo/battles
  baseRequest(`/battles${query}`, cb);
}

/**
 * getBattleDetails - description
 *
 * @param  {string} battleId description
 * @param  {callback} cb       description
 */
function getBattleDetails(battleId, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/battles/{battleId}
  baseRequest(`/battles/${battleId}`, cb);
}

module.exports = {
  search,
  getServerStatus,
  getRecentKills, getKillDetails, getPlayerFued,
  getRecentEvents, getEventDetails, getEventsBetween,
  getGuildInfo, getGuildData, getGuildTopKills, getGuildStats, getGuildMembers, getGuildFeud, getGuildFued,
  getPlayerInfo, getPlayerSoloKills, getPlayerTopKills, getPlayerKills, getPlayerDeaths,
  getRecentBattles, getBattleDetails
};
