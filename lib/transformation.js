const _ = require('lodash')

function updateState (newState, state) {
  return _.transform(newState, function (obj, value, key) {
    if (value === null && _.has(state, key)) {
      obj[key] = _.get(state, key)
    } else {
      obj[key] = value
    }
  }, {})
}

function endpoint2Device (endpoint) {
  const keyMapper = {
    endpointId: 'deviceId',
    displayType: 'type',
    displayName: 'name',
    recommendRoomName: 'roomName',
    capabilities: 'actions',
    additionalInfo: 'deviceInfo'
  }
  const valueMapper = {
    actions: capabilities => {
      const actions = {}
      capabilities.forEach(cap => {
        actions[cap.interface] = cap.supportedOperations
      })
      return actions
    },
    state: state => {
      const obj = {}
      state.forEach(s => {
        obj[s.interface] = s.value
      })
      return obj
    }
  }
  endpoint = _.mapKeys(endpoint, (value, key) => {
    return keyMapper[key] || key
  })
  endpoint = _.mapValues(endpoint, (value, key) => {
    const mapper = valueMapper[key]
    if (mapper) {
      return mapper(value)
    }
    return value
  })
  return endpoint
}

function device2Endpoint (device) {
  const keyMapper = {
    deviceId: 'endpointId',
    type: 'displayType',
    name: 'displayName',
    roomName: 'recommendRoomName',
    deviceInfo: 'additionalInfo',
    actions: 'capabilities'
  }
  const valueMapper = {
    capabilities: actions => {
      return Object.keys(actions).map(key => {
        return {
          interface: _.capitalize(key),
          supportedOperations: actions[key]
        }
      })
    },
    state: state => {
      return Object.keys(state).map(key => {
        return {
          interface: _.capitalize(key),
          value: state[key]
        }
      })
    }
  }
  device = _.mapKeys(device, (value, key) => {
    return keyMapper[key] || key
  })
  device = _.mapValues(device, (value, key) => {
    const mapper = valueMapper[key]
    if (mapper) {
      return mapper(value)
    }
    return value
  })
  return device
}

module.exports = { updateState, endpoint2Device, device2Endpoint }