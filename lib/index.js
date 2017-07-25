var debug = require('debug')('AlbionAPI');
var async = require('async');
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
  request(`${BASE_URL}${uri}`, function (error, response, body) {
    debug(`Url: ${BASE_URL}${uri} statusCode: ${response && response.statusCode}`);
    cb(error, JSON.parse(body));
  });
}

/**
 * getServerStatus - description
 *
 * @param  {callback} cb  description
 */
function getServerStatus(cb) {
  async.parallel({
      live: (cb) => {
        request('http://live.albiononline.com/status.txt', (e,r,b) => {
          cb(null, JSON.parse(b.trim()));
        });
      },
      staging: (cb) => {
        request('http://staging.albiononline.com/status.txt', (e,r,b) => {
          cb(null, JSON.parse(b.trim()));
        });
      }
    }, (e, rs) => {
      if(e) {
        return cb(e);
      }

      cb(null, {
        live: {
          status: rs.live.status,
          message: rs.live.message,
        },
        staging: {
          status: rs.staging.status,
          message: rs.staging.message,
        }
      });
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
  baseRequest(`/events`, cb);
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
 * getGuildFued - description
 *
 * @param  {string} guildId1 description
 * @param  {string} guildId2 description
 * @param  {callback} cb       description
 */
function getGuildFued(guildId1, guildId2, cb) {
  // https://gameinfo.albiononline.com/api/gameinfo/guilds/r-pjy3pRSMWx-OKqwT-SBg/feud/55EvzyTZQsG70sOuoGXgog
  baseRequest(`/guilds/${guildId1}/fued/${guildId2}`, cb);
}

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

module.exports = {
  search,
  getServerStatus,
  getRecentKills, getKillDetails, getPlayerFued,
  getRecentEvents, getEventDetails, getEventsBetween,
  getGuildInfo, getGuildData, getGuildTopKills, getGuildStats, getGuildMembers, getGuildFued,
  getPlayerInfo
};
