const Session = require('../lib/session')
const Device = require('../lib/device')

module.exports = async function skillControl (id, directive, value, command) {
  const currentSessionName = Session.getCurrentSessionName()
  const session = new Session(currentSessionName)

  if (!currentSessionName) {
    console.log('please add first')
    return
  }

  const devicesOfSession = Device.getBySessionName(currentSessionName)

  if (devicesOfSession.length === 0) {
    console.log('please list first')
    return
  }

  const targetDevice = devicesOfSession.find(it => it.endpointId === id)

  if (targetDevice == null) {
    console.log('找不到该 endpointId', id)
    return
  }

  const endpoint = await session.request('control', directive, targetDevice, { value })

  Device.updateStateById(targetDevice.deviceId, currentSessionName, targetDevice.state, endpoint.state)
  console.log(JSON.stringify(endpoint, null, 2))
}
